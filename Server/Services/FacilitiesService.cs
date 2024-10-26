using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Server.CustomExceptions;
using Server.Domain;
using Server.Domain.Auth;
using Server.Persistence;
using Server.Persistence.Abstractions.Facility;
using Server.Persistence.Abstractions.Reservation;
using Server.Persistence.Abstractions.TimeSlot;
using System.Linq;

namespace Server.Services
{
    public interface IFacilitiesService
    {
        Task<FacilityDto> CreateAsync(string userId, CreateFacilityDto request);
        Task<bool> DeleteAsync(string userId, bool isAdmin, int id);
        Task<FacilityDto?> GetByIdAsync(int id);
        Task<ICollection<FacilityDto>?> GetListAsync();
        Task<FacilityDto?> UpdateAsync(string userId, bool isAdmin, int id, UpdateFacilityDto request);
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
                .ThenInclude(r => r.User)
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
                .ThenInclude(r => r.User)
                .ToListAsync();

            if (facilities.Count == 0)
            {
                return null;
            }

            return facilities.Select(ToContract).ToList();
        }

        public async Task<FacilityDto> CreateAsync(string userId, CreateFacilityDto request)
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
                FacilityType = (FacilityType)request.FacilityTypeId,
                CreatedById = userId
            };

            _context.Facilities.Add(entity);
            await _context.SaveChangesAsync();

            return ToContract(entity);
        }

        public async Task<FacilityDto?> UpdateAsync(string userId, bool isAdmin, int id, UpdateFacilityDto request)
        {
            _validator.Validate(request, opt => opt.ThrowOnFailures());

            var facility = await _context.Facilities.FindAsync(id);
            if (facility == null)
            {
                return null;
            }

            if (facility.CreatedById != userId && !isAdmin)
            {
                throw new ForbiddenActionException("Only the record owner or an administrator can update this record.");
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

        public async Task<bool> DeleteAsync(string userId, bool isAdmin, int id)
        {
            var facility = await _context.Facilities.FindAsync(id);
            if (facility == null)
            {
                return false;
            }

            if (facility.CreatedById != userId && !isAdmin)
            {
                throw new ForbiddenActionException("Only the record owner or an administrator can delete this record.");
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
                    CreatedById = ts.CreatedById,
                    FacilityId = entity.Id,
                    Reservations = ts.Reservations.Select(r => new ReservationDto()
                    {
                        Id = r.Id,
                        UserId = r.UserId,
                        UserName = r.User.UserName!,
                        UserEmail = r.User.Email!,
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
                CreatedById = entity.CreatedById,
                TimeSlots = timeSlots
            };
        }
    }
}
