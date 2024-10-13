namespace Server.Persistence.Abstractions.Facility
{
    public abstract class BaseFacilityDto
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string? Description { get; set; }
        public string? PictureUrl { get; set; }
        public string PhoneNumber { get; set; }
        public string EmailAddress { get; set; }
        public int? MaxNumberOfParticipants { get; set; }
        public int FacilityTypeId { get; set; }
    }
}
