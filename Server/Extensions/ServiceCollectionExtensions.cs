using FluentValidation;
using Server.Middleware;
using Server.Persistence.Abstractions.Facility;
using Server.Services;
using static Server.Persistence.Abstractions.Facility.CreateFacilityDto;

namespace Server.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddControllers();
            services.AddLogging(lb => lb.AddConsole());
            services.AddScoped<IFacilitiesService, FacilitiesService>();
            services.AddScoped<IReservationsService, ReservationsService>();
            services.AddScoped<ITimeSlotsService, TimeSlotsService>();
            services.AddExceptionHandler<GlobalExceptionHandler>();
            services.AddProblemDetails();
            return services;
        }

        public static IServiceCollection AddValidationServices(this IServiceCollection services)
        {
            services.AddValidatorsFromAssemblyContaining<CreateFacilityDto>();
            return services;
        }
    }
}
