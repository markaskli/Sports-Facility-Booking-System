using FluentValidation;
using Server.Persistence.Abstractions.Facility;

namespace Server.Validators.Facility
{
    public class BaseFacilityValidator : AbstractValidator<BaseFacilityDto>
    {
        public BaseFacilityValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .Length(2, 255);

            RuleFor(x => x.Address)
                .NotEmpty()
                .Length(2, 100);

            RuleFor(x => x.PhoneNumber)
                .NotEmpty()
                .MaximumLength(20);

            RuleFor(x => x.EmailAddress)
                .NotEmpty()
                .EmailAddress();
        }
    }
}
