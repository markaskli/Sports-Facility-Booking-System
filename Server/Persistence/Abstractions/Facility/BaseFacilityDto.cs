namespace Server.Persistence.Abstractions.Facility
{
    public abstract class BaseFacilityDto
    {
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string? Description { get; set; }
        public string? PictureUrl { get; set; }
        public string PhoneNumber { get; set; } = null!;
        public string EmailAddress { get; set; } = null!;
        public int? MaxNumberOfParticipants { get; set; }
        public int FacilityTypeId { get; set; }
    }
}
