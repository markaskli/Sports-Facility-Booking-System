using Microsoft.AspNetCore.Mvc;
using Server.Persistence.Abstractions.TimeSlot;
using Server.Services;

namespace Server.Controllers
{
    [Route("api/v1/facility/{facilityId}/[controller]")]
    [ApiController]
    public class TimeSlotController : ControllerBase
    {
        private readonly ITimeSlotsService _timeSlotsService;
        public TimeSlotController(ITimeSlotsService timeSlotsService)
        {
            _timeSlotsService = timeSlotsService;
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<TimeSlotDto>>> Get(int facilityId)
        {
            var result = await _timeSlotsService.GetListAsync(facilityId);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet("{id}", Name = "GetTimeSlotById")]
        public async Task<ActionResult<TimeSlotDto>> Get(int facilityId, int id)
        {
            var result = await _timeSlotsService.GetByIdAsync(facilityId, id);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<TimeSlotDto>> Create(int facilityId, CreateTimeSlotDto request)
        {
            var result = await _timeSlotsService.CreateAsync(facilityId, request);
            return CreatedAtRoute("GetTimeSlotById", new { facilityId = result.FacilityId, id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TimeSlotDto>> Update(int facilityId, int id, UpdateTimeSlotDto request)
        {
            var result = await _timeSlotsService.UpdateAsync(facilityId, id, request);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int facilityId, int id)
        {
            var result = await _timeSlotsService.DeleteAsync(facilityId, id);
            if (result == false)
            {
                return NotFound();
            }

            return NoContent();
        }

    }
}
