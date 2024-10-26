using Server.Persistence.Abstractions.Reservation;

namespace Server.Persistence.Abstractions.TimeSlot
{
    public class TimeSlotDto : BaseTimeSlotDto
    {
        public int Id { get; set; }
        public ICollection<ReservationDto> Reservations { get; set; }
        public int FacilityId { get; set; }
        public string CreatedById { get; set; } = null!;
        public TimeSlotDto()
        {
            Reservations = new List<ReservationDto>();
        }
    }
}
