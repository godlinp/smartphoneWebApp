using Godlin.Phone.API.Models;
using Godlin.Phone.API.Repositories.SmartphoneRepo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Godlin.Phone.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SmartphonesController : ControllerBase
    {
        ISmartphoneRepository smartphoneRepository;
        
        public SmartphonesController(ISmartphoneRepository smartphoneRepository)
        {
            this.smartphoneRepository = smartphoneRepository;
        }

        [HttpGet]
        public IActionResult GetAllSmartphones()
        {
            var smartphones =  smartphoneRepository.GetAllSmartphones();
            
            var result = smartphones.Select(p=>new
            {
                smartphoneId=p.Id,
                name=p.Name,
                description=p.Description,
                manufacturerName=p.Manufacturer.ManufacturerName,
                specifications1 =p.PhoneSpecification.Processor,
                specifications2 =p.PhoneSpecification.OS,
                specification3 = p.PhoneSpecification.RAM,
                specification4=p.PhoneSpecification.Storage,
            });
            
            return Ok(result);
        }
        
        [HttpPost("Search/Manufacturer")]
        public IActionResult SearchManufacturer(string manufacturerName)
        {
            var result = smartphoneRepository.SearchByManufacturer(manufacturerName);

            return Ok(result);
        }
        
        [HttpPost("Search/Specification")]
        public IActionResult SearchBySpecification(PhoneSpecification spec)
        {
            var result = smartphoneRepository.SearchBySpecification(spec);
            return Ok(result);
        }



        [HttpPost]
       
        public IActionResult AddSmartphone(Smartphone smartphone)
        {
            smartphoneRepository.AddSmartphone(smartphone);
            return Ok("Smartphone Added Successfully");
        }

        [HttpPut("{id}")]
    
        public IActionResult UpdateSmartphone(int id, Smartphone smartphone)
        {
            smartphoneRepository.UpdateSmartphone(id, smartphone);
            return Ok("Smartphone Updated Successfully");
        }

        [HttpPost("Update/{id}")]
        public IActionResult UpdateSmartphonePost(int id, Smartphone smartphone)
        {
            smartphoneRepository.UpdateSmartphone(id, smartphone);
            return Ok("Smartphone Updated Successfully");
        }
        
        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult DeleteSmartphone(int id)
        {
            smartphoneRepository.DeleteSmartphone(id);
            return Ok("Smartphone Deleted Successfully");
        }
        
    }
}
