import Map "mo:core/Map";

module {
  type OldCar = {
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
    status : Text;
    featured : Bool;
    slug : Text;
  };

  type OldBooking = {
    id : Nat;
    customerName : Text;
    phone : Text;
    email : Text;
    carId : Nat;
    date : Text;
    timeSlot : Text;
    status : Text;
  };

  type OldActor = {
    nextCarId : Nat;
    nextBookingId : Nat;
    cars : Map.Map<Nat, OldCar>;
    bookings : Map.Map<Nat, OldBooking>;
    userProfiles : Map.Map<Principal, { name : Text; email : Text }>;
  };

  type NewActor = {
    nextCarId : Nat;
    nextBookingId : Nat;
    cars : Map.Map<Nat, OldCar>;
    bookings : Map.Map<Nat, OldBooking>;
    userProfiles : Map.Map<Principal, { name : Text; email : Text }>;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
