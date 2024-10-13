using Microsoft.AspNetCore.Mvc;
using Server.Persistence.Abstractions.Reservation;
using Server.Services;

namespace Server.Controllers
{
    [Route("api/v1/facility/{facilityId}/timeSlot/{timeSlotId}/[controller]")]
    [ApiController]
    public class ReservationController : ControllerBase
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
            var result = await _reservationsService.CreateAsync(facilityId, timeSlotId, request);
            return CreatedAtAction(nameof(GetById), new { facilityId, timeSlotId = result.TimeSlotId, id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int facilityId, int timeSlotId, int id, UpdateReservationDto request)
        {
            var result = await _reservationsService.UpdateAsync(facilityId, timeSlotId, id, request);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int facilityId, int timeSlotId, int id)
        {
            var result = await _reservationsService.DeleteAsync(facilityId, timeSlotId, id);
            if (result == false)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
