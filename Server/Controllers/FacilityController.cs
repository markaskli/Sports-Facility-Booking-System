using Microsoft.AspNetCore.Mvc;
using Server.Persistence.Abstractions.Facility;
using Server.Services;

namespace Server.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class FacilityController : ControllerBase
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
        public async Task<ActionResult<FacilityDto>> Create(CreateFacilityDto request)
        {
            var result = await _facilitiesService.CreateAsync(request);
            return CreatedAtRoute("GetFacilityById", new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<FacilityDto>> Update(int id, UpdateFacilityDto request)
        {
            var result = await _facilitiesService.UpdateAsync(id, request);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _facilitiesService.DeleteAsync(id);
            if (result == false)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
