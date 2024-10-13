using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Persistence;
using Server.Persistence.Abstractions.Facility;
using Server.Persistence.Abstractions.Reservation;
using Server.Persistence.Abstractions.TimeSlot;
using System.Linq;

namespace Server.Services
{
    public interface IFacilitiesService
    {
        Task<FacilityDto> CreateAsync(CreateFacilityDto request);
        Task<bool> DeleteAsync(int id);
        Task<FacilityDto?> GetByIdAsync(int id);
        Task<ICollection<FacilityDto>?> GetListAsync();
        Task<FacilityDto?> UpdateAsync(int id, UpdateFacilityDto request);
    }

    public class FacilitiesService : IFacilitiesService
    {
        private readonly ReservationDbContext _context;
        private readonly IValidator<BaseFacilityDto> _validator;

        public FacilitiesService(ReservationDbContext context, IValidator<BaseFacilityDto> validator)
        {
            _context = context;
            _validator = validator;
        }

        public async Task<FacilityDto?> GetByIdAsync(int id)
        {
            var facility = await _context.Facilities
                .AsNoTracking()
                .Include(f => f.TimeSlots)
                .ThenInclude(ts => ts.Reservations)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (facility == null)
            {
                return null;
            }

            var result = ToContract(facility);
            return result;
        }

        public async Task<ICollection<FacilityDto>?> GetListAsync()
        {
            var facilities = await _context.Facilities
                .AsNoTracking()
                .Include(f => f.TimeSlots)
                .ThenInclude(ts => ts.Reservations)
                .ToListAsync();

            if (facilities.Count == 0)
            {
                return null;
            }

            return facilities.Select(ToContract).ToList();
        }

        public async Task<FacilityDto> CreateAsync(CreateFacilityDto request)
        {
            _validator.Validate(request, opt => opt.ThrowOnFailures());

            var entity = new Facility()
            {
                Name = request.Name,
                Address = request.Address,
                Description = request.Description,
                PictureUrl = request.PictureUrl,
                PhoneNumber = request.PhoneNumber,
                EmailAddress = request.EmailAddress,
                MaxNumberOfParticipants = request.MaxNumberOfParticipants,
                FacilityType = (FacilityType)request.FacilityTypeId
            };

            _context.Facilities.Add(entity);
            await _context.SaveChangesAsync();

            return ToContract(entity);
        }

        public async Task<FacilityDto?> UpdateAsync(int id, UpdateFacilityDto request)
        {
            _validator.Validate(request, opt => opt.ThrowOnFailures());

            var facility = await _context.Facilities.FindAsync(id);
            if (facility == null)
            {
                return null;
            }

            facility.Name = request.Name;
            facility.Address = request.Address;
            facility.Description = request.Description;
            facility.PictureUrl = request.PictureUrl;
            facility.PhoneNumber = request.PhoneNumber;
            facility.EmailAddress = request.EmailAddress;
            facility.MaxNumberOfParticipants = request.MaxNumberOfParticipants;
            facility.FacilityType = (FacilityType)request.FacilityTypeId;

            await _context.SaveChangesAsync();
            return ToContract(facility);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var facility = await _context.Facilities.FindAsync(id);
            if (facility == null)
            {
                return false;
            }

            _context.Facilities.Remove(facility);
            await _context.SaveChangesAsync();

            return true;
        }

        private static FacilityDto ToContract(Facility entity)
        {
            var timeSlots = entity.TimeSlots.Select(ts =>
            {
                var defaultDateOnly = new DateOnly();

                return new TimeSlotDto()
                {
                    Id = ts.Id,
                    StartTime = new DateTime(defaultDateOnly, ts.StartTime),
                    EndTime = new DateTime(defaultDateOnly, ts.EndTime),
                    FacilityId = entity.Id,
                    Reservations = ts.Reservations.Select(r => new ReservationDto()
                    {
                        Id = r.Id,
                        UserId = r.UserId,
                        UserName = "John",
                        UserSurname = "Doe",
                        ReservationDate = new DateTime(r.ReservationDate, new TimeOnly()),
                        ReservationStatus = r.ReservationStatus.ToString(),
                        NumberOfParticipants = r.NumberOfParticipants,
                        TimeSlotId = r.TimeSlotId
                    }).ToList()
                };
            }).ToList();

            return new FacilityDto()
            {
                Id = entity.Id,
                Name = entity.Name,
                Address = entity.Address,
                Description = entity.Description,
                PictureUrl = entity.PictureUrl,
                PhoneNumber = entity.PhoneNumber,
                EmailAddress = entity.EmailAddress,
                MaxNumberOfParticipants = entity.MaxNumberOfParticipants,
                FacilityType = entity.FacilityType.ToString(),
                FacilityTypeId = (int)entity.FacilityType,
                TimeSlots = timeSlots
            };
        }
    }
}
