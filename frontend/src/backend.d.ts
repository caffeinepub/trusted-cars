import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Booking {
    id: bigint;
    customerName: string;
    status: string;
    carId: bigint;
    date: string;
    email: string;
    phone: string;
    timeSlot: string;
}
export interface CarInput {
    emi: bigint;
    status: string;
    model: string;
    title: string;
    featured: boolean;
    ownership: string;
    slug: string;
    year: bigint;
    description: string;
    transmission: string;
    fuelType: string;
    kmDriven: bigint;
    brand: string;
    price: bigint;
    images: Array<string>;
}
export interface UserProfile {
    name: string;
    email: string;
}
export interface Car {
    id: bigint;
    emi: bigint;
    status: string;
    model: string;
    title: string;
    featured: boolean;
    ownership: string;
    slug: string;
    year: bigint;
    description: string;
    transmission: string;
    fuelType: string;
    kmDriven: bigint;
    brand: string;
    price: bigint;
    images: Array<string>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBooking(bookingInput: Booking): Promise<Booking>;
    addCar(carInput: CarInput): Promise<Car>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteCar(id: bigint): Promise<void>;
    getBookings(): Promise<Array<Booking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCarBySlug(slug: string): Promise<Car>;
    getCars(): Promise<Array<Car>>;
    getFeaturedCars(): Promise<Array<Car>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markCarAsSold(id: bigint): Promise<Car>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBookingStatus(id: bigint, status: string): Promise<void>;
    updateCar(id: bigint, carInput: CarInput): Promise<Car>;
}
