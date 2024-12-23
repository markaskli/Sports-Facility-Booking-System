import axiosInstance from "../axiosInstance";
import { TimeSlotDto } from "../models/timeSlot";

export const fetchTimeSlots = async (facilityId: number) => {
  const { data } = await axiosInstance.get(`/facility/${facilityId}/timeslot`);
  return data;
};

export const fetchTimeSlotById = async (
  facilityId: number,
  timeSlotId: number
) : Promise<TimeSlotDto> => {
  const { data } = await axiosInstance.get(
    `/facility/${facilityId}/timeslot/${timeSlotId}`
  );
  return data;
};

export const createTimeSlot = async (
  facilityId: number,
  newTimeSlotData: any
) => {
  const { data } = await axiosInstance.post(
    `/facility/${facilityId}/timeslot`,
    newTimeSlotData
  );
  return data;
};

export const updateTimeSlot = async (
  facilityId: number,
  timeSlotId: number,
  updatedTimeSlotData: any
) => {
  const { data } = await axiosInstance.put(
    `/facility/${facilityId}/timeslot/${timeSlotId}`,
    updatedTimeSlotData
  );
  return data;
};

export const deleteTimeSlot = async (
  facilityId: number,
  timeSlotId: number
) => {
  await axiosInstance.delete(`/facility/${facilityId}/timeslot/${timeSlotId}`);
};
