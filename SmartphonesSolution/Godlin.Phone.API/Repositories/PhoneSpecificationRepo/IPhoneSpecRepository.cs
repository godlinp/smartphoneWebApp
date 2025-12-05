using Godlin.Phone.API.Models;

namespace Godlin.Phone.API.Repositories.PhoneSpecificationRepo;

public interface IPhoneSpecRepository
{
     List<PhoneSpecification> GetPhoneSpecifications();
    
     PhoneSpecification GetPhoneSpecification(int id);
    
     void AddPhoneSpecification(PhoneSpecification phoneSpecification);

     bool UpdatePhoneSpecification(int id, PhoneSpecification phoneSpecification);
    
     bool DeletePhoneSpecification(int id);
    
    
}