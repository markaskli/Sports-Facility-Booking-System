﻿namespace Server.Domain
{
    public class TimeSlot
    {
        public int Id { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public ICollection<Reservation> Reservations { get; set; }
        public int FacilityId { get; set; }
        public virtual Facility Facility { get; set; } = null!;

        public TimeSlot()
        {
            Reservations = new List<Reservation>();
        }
    }
}
