using Godlin.Phone.API.Models;
using Godlin.Phone.API.Repositories.PhoneSpecificationRepo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Godlin.Phone.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhoneSpecficationsController : ControllerBase
    {
        IPhoneSpecRepository phoneSpecRepository;
        public PhoneSpecficationsController(IPhoneSpecRepository phoneSpecRepository)
        {
            this.phoneSpecRepository = phoneSpecRepository;
        }
        [HttpGet]
        [Authorize]
        public IActionResult ListPhoneSpecifications()
        {
            var ListPhoneSpecifications = phoneSpecRepository.GetPhoneSpecifications();
            return Ok(ListPhoneSpecifications);
        }

        [HttpPost]
        [Authorize]
        public IActionResult AddPhoneSpecification(PhoneSpecification PhoneSpecification)
        {
            phoneSpecRepository.AddPhoneSpecification(PhoneSpecification);
            return Ok("Phone Specification Added Successfully");
        }

        [HttpPut("{id}")]
        public IActionResult UpdatePhoneSpecification(int id, PhoneSpecification PhoneSpecification)
        {
            var IsUpdated = phoneSpecRepository.UpdatePhoneSpecification(id, PhoneSpecification);
            if (IsUpdated)
            {
                return Ok("Phone Specification Updated Successfully");
            }
            return BadRequest("Phone Specification Not Updated");
        }
        
    }
}
