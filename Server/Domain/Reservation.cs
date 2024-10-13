namespace Server.Domain
{
    public class Reservation
    {
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public DateOnly ReservationDate { get; set; }
        public ReservationStatus ReservationStatus { get; set; }
        public int? NumberOfParticipants { get; set; }
        public int TimeSlotId { get; set; }
        public virtual TimeSlot TimeSlot { get; set; } = null!;

        public Reservation()
        {
            ReservationStatus = ReservationStatus.Pending;
        }
    }
}
