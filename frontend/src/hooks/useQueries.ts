import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { useAdminActor, clearAdminToken } from "./useAdminActor";
import { createActorWithConfig } from "../config";
import type { CarInput, Booking } from "../backend";

// ── Car Queries ──────────────────────────────────────────────────────────────

export function useGetCars() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["cars"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCars();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeaturedCars() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["featuredCars"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedCars();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCarBySlug(slug: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["car", slug],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCarBySlug(slug);
    },
    enabled: !!actor && !isFetching && !!slug,
  });
}

// ── Admin Auth ───────────────────────────────────────────────────────────────

const ADMIN_EMAIL = "hiteshmodi2007@gmail.com";
const ADMIN_PASSWORD = "Hitesh1234@";

export function useAdminLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        throw new Error("Invalid email or password. Please try again.");
      }

      // Mark as admin in localStorage so the admin actor can be initialized
      localStorage.setItem("isAdmin", "true");

      // Invalidate the admin actor query so it gets recreated
      queryClient.invalidateQueries({ queryKey: ["adminActor"] });

      return true;
    },
  });
}

export function useAdminLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem("isAdmin");
      clearAdminToken();
      queryClient.clear();
    },
  });
}

export function useIsAdmin() {
  return localStorage.getItem("isAdmin") === "true";
}

// Helper: create a fresh admin actor (no token required — uses canister's built-in access control)
async function createFreshAdminActor() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  if (!isAdmin) throw new Error("Not authenticated as admin. Please log in again.");
  const actor = await createActorWithConfig();
  // Initialize with empty secret — the canister uses principal-based access control
  await actor._initializeAccessControlWithSecret("");
  return actor;
}

// ── Car Mutations (Admin) ────────────────────────────────────────────────────

export function useAddCar() {
  const { actor } = useAdminActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (carInput: CarInput) => {
      const adminActor = actor ?? (await createFreshAdminActor());
      return adminActor.addCar(carInput);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["featuredCars"] });
    },
    onError: (error) => {
      console.error("Error adding car:", error);
    },
  });
}

export function useUpdateCar() {
  const { actor } = useAdminActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, carInput }: { id: bigint; carInput: CarInput }) => {
      const adminActor = actor ?? (await createFreshAdminActor());
      return adminActor.updateCar(id, carInput);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["featuredCars"] });
    },
    onError: (error) => {
      console.error("Error updating car:", error);
    },
  });
}

export function useDeleteCar() {
  const { actor } = useAdminActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      const adminActor = actor ?? (await createFreshAdminActor());
      return adminActor.deleteCar(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["featuredCars"] });
    },
  });
}

export function useMarkCarAsSold() {
  const { actor } = useAdminActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      const adminActor = actor ?? (await createFreshAdminActor());
      return adminActor.markCarAsSold(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
  });
}

// ── Booking Mutations ────────────────────────────────────────────────────────

export function useAddBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingInput: Booking) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addBooking(bookingInput);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useGetBookings() {
  const { actor: adminActor, isFetching: adminFetching } = useAdminActor();
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!adminActor) return [];
      return adminActor.getBookings();
    },
    enabled: !!adminActor && !adminFetching,
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useAdminActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: string }) => {
      const adminActor = actor ?? (await createFreshAdminActor());
      return adminActor.updateBookingStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
