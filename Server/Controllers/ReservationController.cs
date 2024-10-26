using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Persistence.Abstractions.Reservation;
using Server.Services;

namespace Server.Controllers
{
    [Route("api/v1/facility/{facilityId}/timeSlot/{timeSlotId}/[controller]")]
    public class ReservationController : BaseController
    {
        private readonly IReservationsService _reservationsService;
        public ReservationController(IReservationsService reservationsService)
        {
            _reservationsService = reservationsService;
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<ReservationDto>>> Get(int facilityId, int timeSlotId)
        {
            var result = await _reservationsService.GetListAsync(facilityId, timeSlotId);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet("{id}", Name = "GetReservationById")]
        public async Task<ActionResult> GetById(int facilityId, int timeSlotId, int id)
        {
            var result = await _reservationsService.GetByIdAsync(facilityId, timeSlotId, id);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult> Create(int facilityId, int timeSlotId, CreateReservationDto request)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return BadRequest("Provided access token is invalid.");
            }

            var result = await _reservationsService.CreateAsync(userId, facilityId, timeSlotId, request);
            return CreatedAtAction(nameof(GetById), new { facilityId, timeSlotId = result.TimeSlotId, id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int facilityId, int timeSlotId, int id, UpdateReservationDto request)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return BadRequest("Provided access token is invalid.");
            }

            var isAdmin = IsAdmin();

            var result = await _reservationsService.UpdateAsync(userId, isAdmin, facilityId, timeSlotId, id, request);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int facilityId, int timeSlotId, int id)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return BadRequest("Provided access token is invalid.");
            }

            var isAdmin = IsAdmin();

            var result = await _reservationsService.DeleteAsync(userId, isAdmin, facilityId, timeSlotId, id);
            if (result == false)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
