using FluentValidation;
using Server.Persistence.Abstractions.TimeSlot;

namespace Server.Validators.TimeSlot
{
    public class BaseTimeSlotValidator : AbstractValidator<BaseTimeSlotDto>
    {
        public BaseTimeSlotValidator()
        {
            RuleFor(x => x.StartTime)
                .NotEmpty()
                .LessThan(x => x.EndTime)
                    .WithMessage("'Start Time' must be earlier than 'End Time'");

            RuleFor(x => x.EndTime)
                .NotEmpty()
                .GreaterThan(x => x.StartTime)
                    .WithMessage("'End Time' must be later than 'Start Time'");
        }
    }
}
