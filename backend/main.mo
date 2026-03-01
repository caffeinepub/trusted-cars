import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Debug "mo:core/Debug";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Authorization setup
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile type
  public type UserProfile = {
    name : Text;
    email : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Data types
  module Car {
    public func compare(car1 : Car, car2 : Car) : Order.Order {
      Nat.compare(car1.id, car2.id);
    };
  };

  type Car = {
    id : Nat;
    title : Text;
    brand : Text;
    model : Text;
    year : Nat;
    kmDriven : Nat;
    fuelType : Text;
    transmission : Text;
    ownership : Text;
    price : Nat;
    emi : Nat;
    description : Text;
    images : [Text];
    status : Text; // "Available" | "Sold"
    featured : Bool;
    slug : Text;
  };

  type CarInput = {
    title : Text;
    brand : Text;
    model : Text;
    year : Nat;
    kmDriven : Nat;
    fuelType : Text;
    transmission : Text;
    ownership : Text;
    price : Nat;
    emi : Nat;
    description : Text;
    images : [Text];
    status : Text;
    featured : Bool;
    slug : Text;
  };

  type Booking = {
    id : Nat;
    customerName : Text;
    phone : Text;
    email : Text;
    carId : Nat;
    date : Text;
    timeSlot : Text;
    status : Text;
  };

  // Persistent state for car and booking IDs
  var nextCarId = 1;
  var nextBookingId = 1;

  let cars = Map.empty<Nat, Car>();
  let bookings = Map.empty<Nat, Booking>();

  // ── Car Management (Admin only) ──────────────────────────────────────────

  public shared ({ caller }) func addCar(carInput : CarInput) : async Car {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add cars");
    };
    let car : Car = {
      id = nextCarId;
      title = carInput.title;
      brand = carInput.brand;
      model = carInput.model;
      year = carInput.year;
      kmDriven = carInput.kmDriven;
      fuelType = carInput.fuelType;
      transmission = carInput.transmission;
      ownership = carInput.ownership;
      price = carInput.price;
      emi = carInput.emi;
      description = carInput.description;
      images = carInput.images;
      status = "Available";
      featured = carInput.featured;
      slug = carInput.slug;
    };
    Debug.print("Adding car with data: " # debug_show (car));
    cars.add(nextCarId, car);
    Debug.print("Car added. New cars map size: " # debug_show (cars.size()));
    nextCarId += 1;
    car;
  };

  public shared ({ caller }) func updateCar(id : Nat, carInput : CarInput) : async Car {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update cars");
    };
    switch (cars.get(id)) {
      case (null) { Runtime.trap("Car not found") };
      case (?_) {
        let updatedCar : Car = {
          id;
          title = carInput.title;
          brand = carInput.brand;
          model = carInput.model;
          year = carInput.year;
          kmDriven = carInput.kmDriven;
          fuelType = carInput.fuelType;
          transmission = carInput.transmission;
          ownership = carInput.ownership;
          price = carInput.price;
          emi = carInput.emi;
          description = carInput.description;
          images = carInput.images;
          status = "Available";
          featured = carInput.featured;
          slug = carInput.slug;
        };
        cars.add(id, updatedCar);
        updatedCar;
      };
    };
  };

  public shared ({ caller }) func deleteCar(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete cars");
    };
    if (not cars.containsKey(id)) {
      Runtime.trap("Car not found");
    };
    cars.remove(id);
  };

  public shared ({ caller }) func markCarAsSold(id : Nat) : async Car {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can mark cars as sold");
    };
    switch (cars.get(id)) {
      case (null) { Runtime.trap("Car not found") };
      case (?car) {
        let updatedCar : Car = {
          car with
          status = "Sold";
        };
        cars.add(id, updatedCar);
        updatedCar;
      };
    };
  };

  // ── Car Queries (Public) ─────────────────────────────────────────────────

  public query func getCars() : async [Car] {
    cars.values().toArray().sort();
  };

  public query func getCarBySlug(slug : Text) : async Car {
    switch (cars.values().find(func(car : Car) : Bool { car.slug == slug })) {
      case (null) { Runtime.trap("Car not found") };
      case (?car) { car };
    };
  };

  public query func getFeaturedCars() : async [Car] {
    cars.values().filter(func(car : Car) : Bool { car.featured }).toArray();
  };

  // ── Booking Management ───────────────────────────────────────────────────

  // Anyone (including guests) can book a test drive
  public shared func addBooking(bookingInput : Booking) : async Booking {
    let booking : Booking = {
      bookingInput with
      id = nextBookingId;
      status = "Pending";
    };
    bookings.add(nextBookingId, booking);
    nextBookingId += 1;
    booking;
  };

  // Only admins can view all bookings
  public query ({ caller }) func getBookings() : async [Booking] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    bookings.values().toArray();
  };

  // Only admins can update booking status
  public shared ({ caller }) func updateBookingStatus(id : Nat, status : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update booking status");
    };
    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking : Booking = {
          booking with
          status;
        };
        bookings.add(id, updatedBooking);
      };
    };
  };
};
