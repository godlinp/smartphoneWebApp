using Godlin.Phone.API.Context;
using Godlin.Phone.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Godlin.Phone.API.Repositories.PhoneSpecificationRepo;

public class PhoneSpecRepository: IPhoneSpecRepository
{
    SmartPhonesDbContext smartPhonesDbContext;

    public PhoneSpecRepository(SmartPhonesDbContext smartPhonesDbContext)
    {
        this.smartPhonesDbContext = smartPhonesDbContext;
    }
    
    
    
    public List<PhoneSpecification> GetPhoneSpecifications()
    {
        return smartPhonesDbContext.PhoneSpecifications.Include(p=>p.Phones).ToList();
    }

    public PhoneSpecification GetPhoneSpecification(int id)
    {
        return smartPhonesDbContext.PhoneSpecifications.FirstOrDefault(p=>p.SpecId == id);
    }

    public void AddPhoneSpecification(PhoneSpecification phoneSpecification)
    {
        smartPhonesDbContext.PhoneSpecifications.Add(phoneSpecification);
        smartPhonesDbContext.SaveChanges();
    }

    public bool UpdatePhoneSpecification(int id, PhoneSpecification phoneSpecification)
    {
        var existingPhoneSpecification = smartPhonesDbContext.PhoneSpecifications.FirstOrDefault(p => p.SpecId == id);
        if (existingPhoneSpecification != null)
        {
            existingPhoneSpecification.OS = phoneSpecification.OS;
            existingPhoneSpecification.Phones = phoneSpecification.Phones;
            existingPhoneSpecification.Processor = phoneSpecification.Processor;
            existingPhoneSpecification.Storage = phoneSpecification.Storage;
            smartPhonesDbContext.SaveChanges();
            return true;
        }
        return false;
       
    }

    public bool DeletePhoneSpecification(int id)
    {
        var existingPhoneSpecification = smartPhonesDbContext.PhoneSpecifications.FirstOrDefault(p => p.SpecId == id);
        smartPhonesDbContext.PhoneSpecifications.Remove(existingPhoneSpecification);
        smartPhonesDbContext.SaveChanges();
        return true;
    }
}