import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Car, Booking } from '../backend';

// ── Car Queries ──────────────────────────────────────────────────────────────

export function useGetCars() {
  const { actor, isFetching } = useActor();
  return useQuery<Car[]>({
    queryKey: ['cars'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCars();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeaturedCars() {
  const { actor, isFetching } = useActor();
  return useQuery<Car[]>({
    queryKey: ['featuredCars'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedCars();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCarBySlug(slug: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Car | null>({
    queryKey: ['car', slug],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCarBySlug(slug);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!slug,
  });
}

// ── Car Mutations ────────────────────────────────────────────────────────────

export function useAddCar() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (carInput: Car) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCar(carInput);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['featuredCars'] });
    },
  });
}

export function useUpdateCar() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, carInput }: { id: bigint; carInput: Car }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCar(id, carInput);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['featuredCars'] });
    },
  });
}

export function useDeleteCar() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCar(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['featuredCars'] });
    },
  });
}

export function useMarkCarAsSold() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markCarAsSold(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['featuredCars'] });
    },
  });
}

// ── Booking Queries ──────────────────────────────────────────────────────────

export function useAddBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingInput: Booking) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addBooking(bookingInput);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useGetBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getBookings();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBookingStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

// ── Admin Auth ───────────────────────────────────────────────────────────────

export function useAdminLogin() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminLogin(email, password);
    },
  });
}
