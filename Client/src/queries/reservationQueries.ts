import axiosInstance from "../axiosInstance";

export const fetchReservations = async (
  facilityId: number,
  timeSlotId: number
) => {
  const { data } = await axiosInstance.get(
    `/facility/${facilityId}/timeslot/${timeSlotId}/reservation`
  );
  return data;
};

export const fetchReservationById = async (
  facilityId: number,
  timeSlotId: number,
  reservationId: number
) => {
  const { data } = await axiosInstance.get(
    `/facility/${facilityId}/timeslot/${timeSlotId}/reservation/${reservationId}`
  );
  return data;
};

export const createReservation = async (
  facilityId: number,
  timeSlotId: number,
  newReservationData: any
) => {
  const { data } = await axiosInstance.post(
    `/facility/${facilityId}/timeslot/${timeSlotId}/reservation`,
    newReservationData
  );
  return data;
};

export const updateReservation = async (
  facilityId: number,
  timeSlotId: number,
  reservationId: number,
  updatedReservationData: any
) => {
  const { data } = await axiosInstance.put(
    `/facility/${facilityId}/timeslot/${timeSlotId}/reservation/${reservationId}`,
    updatedReservationData
  );
  return data;
};

export const deleteReservation = async (
  facilityId: number,
  timeSlotId: number,
  reservationId: number
) => {
  await axiosInstance.delete(
    `/facility/${facilityId}/timeslot/${timeSlotId}/reservation/${reservationId}`
  );
};
