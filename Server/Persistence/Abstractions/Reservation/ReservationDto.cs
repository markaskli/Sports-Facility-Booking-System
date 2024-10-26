using Server.Domain;

namespace Server.Persistence.Abstractions.Reservation
{
    public class ReservationDto : BaseReservationDto
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string UserEmail { get; set; } = null!;
        public string ReservationStatus { get; set; } = null!;
        public int TimeSlotId { get; set; }
    }
}
