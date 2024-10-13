using Server.Domain;

namespace Server.Persistence.Abstractions.Reservation
{
    public class ReservationDto : BaseReservationDto
    {
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; } = null!;
        public string UserSurname { get; set; } = null!;
        public string ReservationStatus { get; set; } = null!;
        public int TimeSlotId { get; set; }
    }
}
