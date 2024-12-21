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

export const getFacilityByIdQuery = (
  facilityId: number,
  timeSlotId: number,
  id: number
) => {
  return useQuery({
    queryKey: [ENTITY_KEY, timeSlotId, id],
    queryFn: () => fetchReservationById(facilityId, timeSlotId, id),
  });
};

export const useCreateFacilityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      facilityId,
      timeSlotId,
      createDto,
    }: {
      facilityId: number;
      timeSlotId: number;
      createDto: CreateReservationDto;
    }) => createReservation(facilityId, timeSlotId, createDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENTITY_KEY] });
    },
  });
};

export const useUpdateFacilityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      facilityId,
      timeSlotId,
      id,
      payload,
    }: {
      facilityId: number;
      timeSlotId: number;
      id: number;
      payload: UpdateReservationDto;
    }) => updateReservation(facilityId, timeSlotId, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENTITY_KEY] });
    },
  });
};

export const useDeleteFacilityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      facilityId,
      timeSlotId,
      id,
    }: {
      facilityId: number;
      timeSlotId: number;
      id: number;
    }) => deleteReservation(facilityId, timeSlotId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENTITY_KEY] });
    },
  });
};
