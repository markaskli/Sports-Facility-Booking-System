import { ReservationDto } from "./reservation";

type BaseTimeSlotDto = {
  startTime: Date;
  endTime: Date;
};

export type TimeSlotDto = {
  id: number;
  startTime: string;
  endTime: string;
  reservations: ReservationDto[];
  facilityId: number;
  createdById: string;
};

export type CreateTimeSlotDto = {
  startTime: string;
  endTime: string;
};

export type UpdateTimeSlotDto = {
  startTime: string;
  endTime: string;
};
