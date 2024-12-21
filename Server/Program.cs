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

app.UseCors(opt => {
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:5173");
});

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
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<ReservationDbContext>();
        context.Database.Migrate();

        var dbSeeder = scope.ServiceProvider.GetRequiredService<DbInitialization>();
        await dbSeeder.SeedAuth();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred while initializing the database: {ex.Message}");
    }
}

app.MapControllers();
app.Run();
