using Server.Domain;

namespace Server.Persistence.Abstractions.Reservation
{
    public class CreateReservationDto : BaseReservationDto
    {
        public Guid UserId { get; set; } = Guid.NewGuid(); // to replace
    }
}
