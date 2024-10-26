using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Server.Domain.Auth;
using Server.Middleware;
using Server.Persistence;
using Server.Persistence.Abstractions.Facility;
using Server.Services;
using System.Text;
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
            services.AddTransient<IJwtTokenService, JwtTokenService>();
            services.AddScoped<ISessionService, SessionService>();
            services.AddScoped<DbInitialization>();
            services.AddExceptionHandler<GlobalExceptionHandler>();
            services.AddProblemDetails();
            return services;
        }

        public static IServiceCollection AddValidationServices(this IServiceCollection services)
        {
            services.AddValidatorsFromAssemblyContaining<CreateFacilityDto>();
            return services;
        }

        public static IServiceCollection AddAuthServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddIdentity<User, IdentityRole>()
                .AddEntityFrameworkStores<ReservationDbContext>()
                .AddDefaultTokenProviders();

            services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(opt =>
            {
                opt.MapInboundClaims = false;
                opt.TokenValidationParameters.ValidAudience = configuration["Jwt:ValidAudience"];
                opt.TokenValidationParameters.ValidIssuer = configuration["Jwt:ValidIssuer"];
                opt.TokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Secret"]));
            });

            services.AddAuthorization();

            return services;
        }
    }
}
