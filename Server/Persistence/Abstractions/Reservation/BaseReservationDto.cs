namespace Server.Persistence.Abstractions.Reservation
{
    public abstract class BaseReservationDto
    {
        public DateTime ReservationDate { get; set; }
        public int? NumberOfParticipants { get; set; }
    }
}
