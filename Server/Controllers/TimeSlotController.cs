using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Domain;
using Server.Persistence.Abstractions.TimeSlot;
using Server.Services;

namespace Server.Controllers
{
    [Route("api/v1/facility/{facilityId}/[controller]")]
    public class TimeSlotController : BaseController
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
        [Authorize(Roles = Roles.FacilityAdministrator)]
        public async Task<ActionResult<TimeSlotDto>> Create(int facilityId, CreateTimeSlotDto request)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return BadRequest("Provided access token is invalid.");
            }

            var result = await _timeSlotsService.CreateAsync(userId, facilityId, request);
            return CreatedAtRoute("GetTimeSlotById", new { facilityId = result.FacilityId, id = result.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = Roles.FacilityAdministrator)]
        public async Task<ActionResult<TimeSlotDto>> Update(int facilityId, int id, UpdateTimeSlotDto request)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return BadRequest("Provided access token is invalid.");
            }

            var isAdmin = IsAdmin();

            var result = await _timeSlotsService.UpdateAsync(userId, isAdmin, facilityId, id, request);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = Roles.FacilityAdministrator)]
        public async Task<ActionResult> Delete(int facilityId, int id)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return BadRequest("Provided access token is invalid.");
            }

            var isAdmin = IsAdmin();

            var result = await _timeSlotsService.DeleteAsync(userId, isAdmin, facilityId, id);
            if (result == false)
            {
                return NotFound();
            }

            return NoContent();
        }

    }
}
