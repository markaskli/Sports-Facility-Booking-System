namespace Server.Persistence.Abstractions.TimeSlot
{
    public abstract class BaseTimeSlotDto
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
