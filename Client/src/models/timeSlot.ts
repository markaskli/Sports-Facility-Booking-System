import { ReservationDto } from "./reservation";

type BaseTimeSlotDto = {
  startTime: Date,
  endTime: Date
}

export type TimeSlotDto = {
  id: number;
  startTime: string;
  endTime: string;
  reservations: ReservationDto[];
  facilityId: number;
  createdById: string;
};

export type CreateTimeSlotDto = BaseTimeSlotDto & {

}

export type UpdateTimeSlotDto = BaseTimeSlotDto & {

}
