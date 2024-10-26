using Microsoft.EntityFrameworkCore;
using Server.Extensions;
using Server.Persistence;

var builder = WebApplication.CreateBuilder(args);
{
    builder.Services
        .AddServices()
        .AddValidationServices()
        .AddDbContext<ReservationDbContext>(opt => opt.UseNpgsql(builder.Configuration["ConnectionStrings:DefaultConnection"]))
        .AddAuthServices(builder.Configuration)
        .AddEndpointsApiExplorer()
        .AddSwaggerGen();
}

var app = builder.Build();
app.UseExceptionHandler();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

}

app.UseAuthentication();
app.UseAuthorization();

using (var scope = app.Services.CreateScope())
{
    var dbSeeder = scope.ServiceProvider.GetRequiredService<DbInitialization>();
    await dbSeeder.SeedAuth();
}

app.MapControllers();
app.Run();
