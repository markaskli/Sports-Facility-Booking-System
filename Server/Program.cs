using Microsoft.EntityFrameworkCore;
using Server.Extensions;
using Server.Persistence;

var builder = WebApplication.CreateBuilder(args);
{
    builder.Services
        .AddServices()
        .AddValidationServices()
        .AddDbContext<ReservationDbContext>(opt => opt.UseNpgsql(builder.Configuration["ConnectionStrings:DefaultConnection"]))
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


app.MapControllers();
app.Run();
