using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Persistence;
using Server.Persistence.Abstractions.Reservation;
using Server.Persistence.Abstractions.TimeSlot;
using Server.Validators.TimeSlot;

namespace Server.Services
{
    public interface ITimeSlotsService
    {
        Task<TimeSlotDto> CreateAsync(int facilityId, CreateTimeSlotDto request);
        Task<bool> DeleteAsync(int facilityId, int id);
        Task<TimeSlotDto?> GetByIdAsync(int facilityId, int id);
        Task<ICollection<TimeSlotDto>?> GetListAsync(int facilityId);
        Task<TimeSlotDto?> UpdateAsync(int facilityId, int id, UpdateTimeSlotDto request);
    }

    public class TimeSlotsService : ITimeSlotsService
    {
        private readonly ReservationDbContext _context;
        private readonly IValidator<BaseTimeSlotDto> _validator;

        public TimeSlotsService(ReservationDbContext context, IValidator<BaseTimeSlotDto> validator)
        {
            _context = context;
            _validator = validator;
        }

        public async Task<TimeSlotDto?> GetByIdAsync(int facilityId, int id)
        {
            var timeSlot = await _context.TimeSlots
                .AsNoTracking()
                .Include(ts => ts.Reservations)
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
            var timeSlots = await _context.TimeSlots
                .AsNoTracking()
                .Include(ts => ts.Reservations)
                .Where(ts => ts.FacilityId == facilityId)
                .ToListAsync();

            if (timeSlots.Count == 0)
            {
                return null;
            }

            return timeSlots.Select(ToContract).ToList();
        }

        public async Task<TimeSlotDto> CreateAsync(int facilityId, CreateTimeSlotDto request)
        {
            _validator.Validate(request, opt => opt.ThrowOnFailures());

            await ValidateFacilityId(facilityId);

            var timeSlot = new TimeSlot()
            {
                StartTime = TimeOnly.FromDateTime(request.StartTime),
                EndTime = TimeOnly.FromDateTime(request.EndTime),
                FacilityId = facilityId
            };

            _context.TimeSlots.Add(timeSlot);
            await _context.SaveChangesAsync();

            return ToContract(timeSlot);
        }

        public async Task<TimeSlotDto?> UpdateAsync(int facilityId, int id, UpdateTimeSlotDto request)
        {
            _validator.Validate(request, opt => opt.ThrowOnFailures());

            await ValidateFacilityId(facilityId);

            var timeSlot = await _context.TimeSlots
                .SingleOrDefaultAsync(ts => ts.Id == id && ts.FacilityId == facilityId);

            if (timeSlot == null)
            {
                return null;
            }

            timeSlot.StartTime = TimeOnly.FromDateTime(request.StartTime);
            timeSlot.EndTime = TimeOnly.FromDateTime(request.EndTime);
            await _context.SaveChangesAsync();

            return ToContract(timeSlot);
        }

        public async Task<bool> DeleteAsync(int facilityId, int id)
        {
            var timeSlot = await _context.TimeSlots
                .SingleOrDefaultAsync(ts => ts.Id == id && ts.FacilityId == facilityId);

            if (timeSlot == null)
            {
                return false;
            }

            _context.TimeSlots.Remove(timeSlot);
            await _context.SaveChangesAsync();

            return true;
        }

        private async Task ValidateFacilityId(int facilityId)
        {
            var isValid = await _context.Facilities.AnyAsync(f => f.Id == facilityId);
            if (!isValid)
            {
                throw new KeyNotFoundException($"Facility with ID {facilityId} was not found.");
            }
        }

        private static TimeSlotDto ToContract(TimeSlot entity)
        {
            var reservations = entity.Reservations
                .Select(r => new ReservationDto()
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    UserName = "John",
                    UserSurname = "Doe",
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
                Reservations = reservations
            };
        }
    }
}
