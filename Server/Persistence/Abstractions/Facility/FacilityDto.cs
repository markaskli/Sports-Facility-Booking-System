using Server.Persistence.Abstractions.TimeSlot;

namespace Server.Persistence.Abstractions.Facility
{
    public class FacilityDto : BaseFacilityDto
    {
        public int Id { get; set; }
        public string FacilityType { get; set; } = null!;
        public ICollection<TimeSlotDto> TimeSlots { get; set; }
        public string CreatedById { get; set; } = null!;
        public FacilityDto()
        {
            TimeSlots = new List<TimeSlotDto>();
        }
    }
}
