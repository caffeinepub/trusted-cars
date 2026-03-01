import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Migration "migration";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

(with migration = Migration.run)
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

  // Stable state for persistence across upgrades
  stable var nextCarId = 1;
  stable var nextBookingId = 1;

  let cars = Map.empty<Nat, Car>();
  let bookings = Map.empty<Nat, Booking>();

  // Updated admin credentials
  let adminEmail = "hiteshmodi2007@gmail.com";
  let adminPassword = "Hitesh1234@";

  // ── Car Management (Admin only) ──────────────────────────────────────────

  public shared ({ caller }) func addCar(carInput : Car) : async Car {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add cars");
    };
    let car : Car = {
      carInput with
      id = nextCarId;
    };
    cars.add(nextCarId, car);
    nextCarId += 1;
    car;
  };

  public shared ({ caller }) func updateCar(id : Nat, carInput : Car) : async Car {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update cars");
    };
    switch (cars.get(id)) {
      case (null) { Runtime.trap("Car not found") };
      case (?_) {
        let updatedCar : Car = {
          carInput with
          id;
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

  // ── Admin Authentication ─────────────────────────────────────────────────

  // Validates credentials and assigns the #admin role to the caller principal
  public shared ({ caller }) func adminLogin(email : Text, password : Text) : async Bool {
    if (email == adminEmail and password == adminPassword) {
      // Assign admin role to the calling principal
      AccessControl.assignRole(accessControlState, caller, caller, #admin);
      return true;
    };
    false;
  };
};
