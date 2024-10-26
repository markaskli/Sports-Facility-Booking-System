using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Server.CustomExceptions;
using Server.Domain;
using Server.Persistence;
using Server.Persistence.Abstractions.Reservation;
using Server.Persistence.Abstractions.TimeSlot;
using Server.Validators.TimeSlot;

namespace Server.Services
{
    public interface ITimeSlotsService
    {
        Task<TimeSlotDto> CreateAsync(string userId, int facilityId, CreateTimeSlotDto request);
        Task<bool> DeleteAsync(string userId, bool isAdmin, int facilityId, int id);
        Task<TimeSlotDto?> GetByIdAsync(int facilityId, int id);
        Task<ICollection<TimeSlotDto>?> GetListAsync(int facilityId);
        Task<TimeSlotDto?> UpdateAsync(string userId, bool isAdmin, int facilityId, int id, UpdateTimeSlotDto request);
    }

    public class TimeSlotsService : ITimeSlotsService
    {
        private readonly ReservationDbContext _dbContext;
        private readonly IValidator<BaseTimeSlotDto> _validator;

        public TimeSlotsService(ReservationDbContext context, IValidator<BaseTimeSlotDto> validator)
        {
            _dbContext = context;
            _validator = validator;
        }

        public async Task<TimeSlotDto?> GetByIdAsync(int facilityId, int id)
        {
            var timeSlot = await _dbContext.TimeSlots
                .AsNoTracking()
                .Include(ts => ts.Reservations)
                .ThenInclude(r => r.User)
                .SingleOrDefaultAsync(e => e.FacilityId == facilityId && e.Id == id);

            if (timeSlot == null)
            {
                return null;
            }

            var result = ToContract(timeSlot);
            return result;
        }

        public async Task<ICollection<TimeSlotDto>?> GetListAsync(int facilityId)
        {
            var timeSlots = await _dbContext.TimeSlots
                .AsNoTracking()
                .Include(ts => ts.Reservations)
                .ThenInclude(r => r.User)
                .Where(ts => ts.FacilityId == facilityId)
                .ToListAsync();

            if (timeSlots.Count == 0)
            {
                return null;
            }

            return timeSlots.Select(ToContract).ToList();
        }

        public async Task<TimeSlotDto> CreateAsync(string userId, int facilityId, CreateTimeSlotDto request)
        {
            _validator.Validate(request, opt => opt.ThrowOnFailures());

            await ValidateFacilityAndCreator(facilityId, userId);

            var timeSlot = new TimeSlot()
            {
                StartTime = TimeOnly.FromDateTime(request.StartTime),
                EndTime = TimeOnly.FromDateTime(request.EndTime),
                FacilityId = facilityId,
                CreatedById = userId
            };

            _dbContext.TimeSlots.Add(timeSlot);
            await _dbContext.SaveChangesAsync();

            return ToContract(timeSlot);
        }

        public async Task<TimeSlotDto?> UpdateAsync(string userId, bool isAdmin, int facilityId, int id, UpdateTimeSlotDto request)
        {
            _validator.Validate(request, opt => opt.ThrowOnFailures());

            await ValidateFacilityId(facilityId);

            var timeSlot = await _dbContext.TimeSlots
                .SingleOrDefaultAsync(ts => ts.Id == id && ts.FacilityId == facilityId);

            if (timeSlot == null)
            {
                return null;
            }

            if (timeSlot.CreatedById != userId && !isAdmin)
            {
                throw new ForbiddenActionException("Only the record owner or an administrator can update this information.");
            }

            timeSlot.StartTime = TimeOnly.FromDateTime(request.StartTime);
            timeSlot.EndTime = TimeOnly.FromDateTime(request.EndTime);
            await _dbContext.SaveChangesAsync();

            return ToContract(timeSlot);
        }

        public async Task<bool> DeleteAsync(string userId, bool isAdmin, int facilityId, int id)
        {
            var timeSlot = await _dbContext.TimeSlots
                .SingleOrDefaultAsync(ts => ts.Id == id && ts.FacilityId == facilityId);

            if (timeSlot == null)
            {
                return false;
            }

            if (timeSlot.CreatedById != userId && !isAdmin)
            {
                throw new ForbiddenActionException("Only the record owner or an administrator can delete this record.");
            }

            _dbContext.TimeSlots.Remove(timeSlot);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        private async Task ValidateFacilityId(int facilityId)
        {
            var isValid = await _dbContext.Facilities.AnyAsync(f => f.Id == facilityId);
            if (!isValid)
            {
                throw new KeyNotFoundException($"Facility with ID {facilityId} was not found.");
            }
        }

        private async Task ValidateFacilityAndCreator(int facilityId, string userId)
        {
            var facility = await _dbContext.Facilities.SingleOrDefaultAsync(f => f.Id == facilityId);
            if (facility == null)
            {
                throw new KeyNotFoundException($"Facility with ID {facilityId} was not found.");
            }

            if (facility.CreatedById != userId)
            {
                throw new ForbiddenActionException("Only facility creator can add time slots.");
            }
        }

        private static TimeSlotDto ToContract(TimeSlot entity)
        {
            var reservations = entity.Reservations
                .Select(r => new ReservationDto()
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    UserName = r.User.UserName!,
                    UserEmail = r.User.Email!,
                    ReservationDate = new DateTime(r.ReservationDate, new TimeOnly()),
                    ReservationStatus = r.ReservationStatus.ToString(),
                    NumberOfParticipants = r.NumberOfParticipants,
                    TimeSlotId = r.TimeSlotId,
                })
                .ToList();

            var defaultDateOnly = new DateOnly();

            return new TimeSlotDto()
            {
                Id = entity.Id,
                StartTime = new DateTime(defaultDateOnly, entity.StartTime),
                EndTime = new DateTime(defaultDateOnly, entity.EndTime),
                FacilityId = entity.FacilityId,
                CreatedById = entity.CreatedById,
                Reservations = reservations
            };
        }
    }
}
