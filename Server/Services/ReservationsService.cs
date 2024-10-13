using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Persistence;
using Server.Persistence.Abstractions.Reservation;

namespace Server.Services
{
    public interface IReservationsService
    {
        Task<ReservationDto> CreateAsync(int facilityId, int timeSlotId, CreateReservationDto request);
        Task<bool> DeleteAsync(int facilityId, int timeSlotId, int id);
        Task<ReservationDto?> GetByIdAsync(int facilityId, int timeSlotId, int id);
        Task<ICollection<ReservationDto>?> GetListAsync(int facilityId, int timeSlotId);
        Task<ReservationDto?> UpdateAsync(int facilityId, int timeSlotId, int id, UpdateReservationDto request);
    }

    public class ReservationsService : IReservationsService
    {
        private readonly ReservationDbContext _context;
        private readonly IValidator<BaseReservationDto> _validator;

        public ReservationsService(ReservationDbContext context, IValidator<BaseReservationDto> validator)
        {
            _context = context;
            _validator = validator;
        }

        public async Task<ReservationDto?> GetByIdAsync(int facilityId, int timeSlotId, int id)
        {
            var reservation = await _context.Reservations
                .AsNoTracking()
                .Include(r => r.TimeSlot)
                .FirstOrDefaultAsync(r => r.Id == id && r.TimeSlotId == timeSlotId && r.TimeSlot.FacilityId == facilityId);

            if (reservation == null)
            {
                return null;
            }

            var result = ToContract(reservation);
            return result;
        }

        public async Task<ICollection<ReservationDto>?> GetListAsync(int facilityId, int timeSlotId)
        {
            var reservations = await _context.Reservations
                .AsNoTracking()
                .Include(r => r.TimeSlot)
                .Where(r => r.TimeSlotId == timeSlotId && r.TimeSlot.FacilityId == facilityId)
                .ToListAsync();

            if (reservations.Count == 0)
            {
                return null;
            }

            return reservations.Select(ToContract).ToList();
        }

        public async Task<ReservationDto> CreateAsync(int facilityId, int timeSlotId, CreateReservationDto request)
        {
            _validator.Validate(request, opt => opt.ThrowOnFailures());

            await ValidateTimeSlotId(facilityId, timeSlotId);

            var reservation = new Reservation()
            {
                UserId = request.UserId,
                ReservationDate = DateOnly.FromDateTime(request.ReservationDate),
                NumberOfParticipants = request.NumberOfParticipants,
                TimeSlotId = timeSlotId,
            };

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            return ToContract(reservation);
        }

        public async Task<ReservationDto?> UpdateAsync(int facilityId, int timeSlotId, int id, UpdateReservationDto request)
        {
            _validator.Validate(request, opt => opt.ThrowOnFailures());

            await ValidateTimeSlotId(facilityId, timeSlotId);

            var reservation = await _context.Reservations
                .Include(r => r.TimeSlot)
                .SingleOrDefaultAsync(r => r.Id == id && r.TimeSlotId == timeSlotId && r.TimeSlot.FacilityId == facilityId);

            if (reservation == null)
            {
                return null;
            }

            // validate date

            reservation.ReservationDate = DateOnly.FromDateTime(request.ReservationDate);
            reservation.NumberOfParticipants = request.NumberOfParticipants;

            await _context.SaveChangesAsync();
            return ToContract(reservation);
        }

        public async Task<bool> DeleteAsync(int facilityId, int timeSlotId, int id)
        {
            var reservation = await _context.Reservations
                .Include(r => r.TimeSlot)
                .SingleOrDefaultAsync(r => r.Id == id && r.TimeSlotId == timeSlotId && r.TimeSlot.FacilityId == facilityId);

            if (reservation == null)
            {
                return false;
            }

            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();

            return true;
        }

        private async Task ValidateTimeSlotId(int facilityId, int timeSlotId)
        {
            var isValid = await _context.TimeSlots.AnyAsync(ts => ts.Id == timeSlotId && ts.FacilityId == facilityId);
            if (!isValid)
            {
                throw new KeyNotFoundException($"Time slot with ID {timeSlotId} was not found.");
            }
        }

        private static ReservationDto ToContract(Reservation entity)
        {
            return new ReservationDto()
            {
                Id = entity.Id,
                ReservationDate = new DateTime(entity.ReservationDate, new TimeOnly()),
                UserId = entity.UserId,
                UserName = "John",
                UserSurname = "Doe",
                NumberOfParticipants = entity.NumberOfParticipants,
                ReservationStatus = entity.ReservationStatus.ToString(),
                TimeSlotId = entity.TimeSlotId
            };
        }
    }
}
