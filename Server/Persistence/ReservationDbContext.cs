using Microsoft.EntityFrameworkCore;
using Server.Domain;

namespace Server.Persistence
{
    public class ReservationDbContext : DbContext
    {
        public ReservationDbContext(DbContextOptions<ReservationDbContext> options) : base(options)
        {
        }

        public DbSet<Facility> Facilities { get; set; }
        public DbSet<TimeSlot> TimeSlots { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<WorkingHours> WorkingHours { get; set; }
    }
}
