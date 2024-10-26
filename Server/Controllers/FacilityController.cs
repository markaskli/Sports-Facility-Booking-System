using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Domain;
using Server.Persistence.Abstractions.Facility;
using Server.Services;

namespace Server.Controllers
{
    [Route("api/v1/[controller]")]
    public class FacilityController : BaseController
    {
        private readonly IFacilitiesService _facilitiesService;
        public FacilityController(IFacilitiesService facilitiesService)
        {
            _facilitiesService = facilitiesService;
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<FacilityDto>>> Get()
        {
            var result = await _facilitiesService.GetListAsync();
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet("{id}", Name = "GetFacilityById")]
        public async Task<ActionResult<FacilityDto>> Get(int id)
        {
            var result = await _facilitiesService.GetByIdAsync(id);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = Roles.FacilityAdministrator)]
        public async Task<ActionResult<FacilityDto>> Create(CreateFacilityDto request)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return BadRequest("Provided access token is invalid.");
            }

            var result = await _facilitiesService.CreateAsync(userId, request);

            return CreatedAtRoute("GetFacilityById", new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = Roles.FacilityAdministrator)]
        public async Task<ActionResult<FacilityDto>> Update(int id, UpdateFacilityDto request)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return BadRequest("Provided access token is invalid.");
            }

            var isAdmin = IsAdmin();

            var result = await _facilitiesService.UpdateAsync(userId, isAdmin, id, request);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = Roles.FacilityAdministrator)]
        public async Task<ActionResult> Delete(int id)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return BadRequest("Provided access token is invalid.");
            }

            var isAdmin = IsAdmin();

            var result = await _facilitiesService.DeleteAsync(userId, isAdmin, id);
            if (result == false)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
