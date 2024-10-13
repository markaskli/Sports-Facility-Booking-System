namespace Server.Domain
{
    public class WorkingHours
    {
        public int Id { get; set; }
        public DateOnly DayOfTheWeek { get; set; }
        public TimeOnly OpeningTime { get; set; } 
        public TimeOnly ClosingTime { get; set; } 
        public int FacilityId { get; set; }
        public virtual Facility Facility { get; set; } = null!;
    }
}
