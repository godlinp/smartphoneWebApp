using Godlin.Phone.API.Models;
using Godlin.Phone.API.Repositories.ManufacturerRepo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Godlin.Phone.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManufacturersController : ControllerBase
    {
        IManufacturerRepository  manufacturerRepository;

        public ManufacturersController(IManufacturerRepository manufacturerRepository)
        {
            this.manufacturerRepository = manufacturerRepository;
        }

        [HttpGet]
        [Authorize]
        public IActionResult GetAllManufacturers()
        {  
            
            return Ok(manufacturerRepository.GetAllManufacturers());
        }

        [HttpPost]
        [Authorize]
        public IActionResult AddManufacturer(Manufacturer manufacturer)
        {
            manufacturerRepository.AddManufacturer(manufacturer);
            return Ok("manufacturer added successfully");
        }

        [HttpPut("{id}")]
        public IActionResult UpdateManufacturer(int id, Manufacturer manufacturer)
        {
            bool IsUpdated = manufacturerRepository.UpdateManufacturer(id, manufacturer);
            if (IsUpdated)
            {
                return Ok("manufacturer updated successfully");
            }
            return BadRequest("manufacturer not updated");
        }
        
        
    }
}
