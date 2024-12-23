import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTimeSlot,
  deleteTimeSlot,
  fetchTimeSlotById,
  fetchTimeSlots,
  updateTimeSlot,
} from "../queries/timeSlotQueries";
import { CreateTimeSlotDto, UpdateTimeSlotDto } from "../models/timeSlot";

const ENTITY_KEY = "time-slots";

export const getTimeSlotsQuery = (facilityId: number) => {
  return useQuery({
    queryKey: [ENTITY_KEY],
    queryFn: () => fetchTimeSlots(facilityId),
    initialData: [],
  });
};

export const getTimeSlotByIdQuery = (facilityId: number, id: number) => {
  return useQuery({
    queryKey: [ENTITY_KEY, id],
    queryFn: () => fetchTimeSlotById(facilityId, id),
  });
};

export const useCreateTimeSlotMutation = (facilityId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ createDto }: { createDto: CreateTimeSlotDto }) =>
      createTimeSlot(facilityId, createDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENTITY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["facilities", facilityId] });
    },
  });
};

export const useUpdateTimeSlotMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      facilityId,
      payload,
    }: {
      facilityId: number;
      payload: UpdateTimeSlotDto;
    }) => updateTimeSlot(facilityId, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENTITY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ENTITY_KEY, id] });
    },
  });
};

export const useDeleteTimeSlotMutation = (facilityId: number, id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteTimeSlot(facilityId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENTITY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ["facilities", facilityId] });
    },
  });
};
