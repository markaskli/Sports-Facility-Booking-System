import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFacility,
  updateFacility,
  deleteFacility,
  fetchFacilities,
  fetchFacilityById,
} from "../queries/facilityQueries";
import { CreateFacilityDto, UpdateFacilityDto } from "../models/facility";

const ENTITY_KEY = "facilities";

export const getFacilitiesQuery = () => {
  return useQuery({
    queryKey: [ENTITY_KEY],
    queryFn: fetchFacilities,
    retry: 2
  });
};

export const getFacilityByIdQuery = (id: number) => {
  return useQuery({
    queryKey: [ENTITY_KEY, id],
    queryFn: () => fetchFacilityById(id)
  })
}


export const useCreateFacilityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFacilityDto) => createFacility(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENTITY_KEY] });
    },
  });
};

export const useUpdateFacilityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateFacilityDto) =>
      updateFacility(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENTITY_KEY] });
    },
  });
};

export const useDeleteFacilityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteFacility(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENTITY_KEY] });
    },
  });
};
