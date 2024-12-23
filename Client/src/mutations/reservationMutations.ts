import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReservation,
  deleteReservation,
  fetchReservationById,
  fetchReservations,
  updateReservation,
} from "../queries/reservationQueries";
import {
  CreateReservationDto,
  UpdateReservationDto,
} from "../models/reservation";

const ENTITY_KEY = "reservations";

export const getReservationsQuery = (
  facilityId: number,
  timeSlotId: number
) => {
  return useQuery({
    queryKey: [ENTITY_KEY],
    queryFn: () => fetchReservations(facilityId, timeSlotId),
    initialData: [],
  });
};

export const getReservationByIdQuery = (
  facilityId: number,
  timeSlotId: number,
  id: number
) => {
  return useQuery({
    queryKey: [ENTITY_KEY, id],
    queryFn: () => fetchReservationById(facilityId, timeSlotId, id),
  });
};

export const useCreateReservationMutation = (timeSlotId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      facilityId,
      createDto,
    }: {
      facilityId: number;
      createDto: CreateReservationDto;
    }) => createReservation(facilityId, timeSlotId, createDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENTITY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["time-slots", timeSlotId] });
    },
  });
};

export const useUpdateReservationMutation = (
  id: number,
  timeSlotId: number
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      facilityId,
      payload,
    }: {
      facilityId: number;
      payload: UpdateReservationDto;
    }) => updateReservation(facilityId, timeSlotId, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENTITY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ["time-slots", timeSlotId] });
    },
  });
};

export const useDeleteReservationMutation = (
  id: number,
  timeSlotId: number
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ facilityId }: { facilityId: number }) =>
      deleteReservation(facilityId, timeSlotId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENTITY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ["time-slots", timeSlotId] });
    },
  });
};
