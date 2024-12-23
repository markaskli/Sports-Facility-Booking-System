export type ReservationDto = {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  reservationStatus: string;
  timeSlotId: number;
  reservationDate: string;
  numberOfParticipants: number | null;
};

// type BaseReservationDto = {
//   reservationDate: Date;
//   numberOfParticipants?: number | null;
// };

export type CreateReservationDto = {
  reservationDate: string;
  numberOfParticipants?: number | null;
};
export type UpdateReservationDto = {
  reservationDate: string;
  numberOfParticipants?: number | null;
};
