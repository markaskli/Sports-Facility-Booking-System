using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Domain.Auth;

namespace Server.Persistence
{
    public class ReservationDbContext : IdentityDbContext<User>
    {
        public ReservationDbContext(DbContextOptions<ReservationDbContext> options) : base(options)
        {
        }

        public DbSet<Facility> Facilities { get; set; }
        public DbSet<TimeSlot> TimeSlots { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<WorkingHours> WorkingHours { get; set; }
        public DbSet<Session> Sessions { get; set; }
    }
}
