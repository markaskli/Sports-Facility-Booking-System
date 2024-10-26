using Server.Domain.Auth;

namespace Server.Domain
{
    public class Facility
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string? Description { get; set; }
        public string? PictureUrl { get; set; }
        public string PhoneNumber { get; set; } = null!;
        public string EmailAddress { get; set; } = null!;
        public int? MaxNumberOfParticipants { get; set; }
        public FacilityType FacilityType { get; set; }
        public string CreatedById { get; set; }
        public User CreatedBy { get; set; } = null!;
        public ICollection<TimeSlot> TimeSlots { get; set; }
        public ICollection<WorkingHours> WorkingHours { get; set; }


        public Facility()
        {
            TimeSlots = new List<TimeSlot>();
            WorkingHours = new List<WorkingHours>();
        }
    }
}
