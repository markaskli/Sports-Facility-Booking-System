using FluentValidation;
using Server.Persistence.Abstractions.Reservation;

namespace Server.Validators.Reservation
{
    public class BaseReservationValidator : AbstractValidator<BaseReservationDto>
    {
        public BaseReservationValidator()
        {
            RuleFor(x => x.ReservationDate).NotEmpty();
        }
    }
}
