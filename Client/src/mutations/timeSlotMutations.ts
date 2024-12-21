import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTimeSlot,
  deleteTimeSlot,
  fetchTimeSlotById,
  fetchTimeSlots,
  updateTimeSlot,
} from "../queries/timeSlotQueries";
import { CreateTimeSlotDto } from "../models/timeSlot";
import { UpdateFacilityDto } from "../models/facility";

const ENTITY_KEY = "time-slots";

export const getTimeSlotsQuery = (facilityId: number) => {
  return useQuery({
    queryKey: [ENTITY_KEY],
    queryFn: () => fetchTimeSlots(facilityId),
    initialData: [],
  });
};

export const getFacilityByIdQuery = (facilityId: number, id: number) => {
  return useQuery({
    queryKey: [ENTITY_KEY, id],
    queryFn: () => fetchTimeSlotById(facilityId, id),
  });
};

export const useCreateTimeSlotMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      facilityId,
      createDto,
    }: {
      facilityId: number;
      createDto: CreateTimeSlotDto;
    }) => createTimeSlot(facilityId, createDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENTITY_KEY] });
    },
  });
};

export const useUpdateTimeSlotMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      facilityId,
      id,
      payload,
    }: {
      facilityId: number;
      id: number;
      payload: UpdateFacilityDto;
    }) => updateTimeSlot(facilityId, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENTITY_KEY] });
    },
  });
};

export const useDeleteTimeSlotMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ facilityId, id }: { facilityId: number; id: number }) =>
      deleteTimeSlot(facilityId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENTITY_KEY] });
    },
  });
};
