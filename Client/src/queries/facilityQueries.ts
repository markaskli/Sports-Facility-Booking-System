import axiosInstance from "../axiosInstance";
import { CreateFacilityDto, FacilityDto, UpdateFacilityDto } from "../models/facility";

export const fetchFacilities = async () => {
  const { data } = await axiosInstance.get("/facility");
  return data;
};

export const fetchFacilityById = async (id: number) : Promise<FacilityDto> => {
  const { data } = await axiosInstance.get(`/facility/${id}`);
  return data;
};

export const createFacility = async (facility: CreateFacilityDto) => {
  const { data } = await axiosInstance.post("/facility", facility);
  return data;
};

export const updateFacility = async ({
  id,
  ...facility
}: UpdateFacilityDto) => {
  const { data } = await axiosInstance.put(`/facility/${id}`, facility);
  return data;
};

export const deleteFacility = async (id: number) => {
  const { data } = await axiosInstance.delete(`/facility/${id}`);
  return data;
};
