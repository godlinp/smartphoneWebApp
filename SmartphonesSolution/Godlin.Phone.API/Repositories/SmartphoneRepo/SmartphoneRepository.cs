using Godlin.Phone.API.Context;
using Godlin.Phone.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Godlin.Phone.API.Repositories.SmartphoneRepo;

public class SmartphoneRepository:ISmartphoneRepository
{
    SmartPhonesDbContext  smartphonesDbContext;

    public SmartphoneRepository( SmartPhonesDbContext  smartphonesDbContext)
    {
        this.smartphonesDbContext = smartphonesDbContext;
        
    }
    public List<Smartphone> GetAllSmartphones()
    {
        return smartphonesDbContext.Phones.Include(x=>x.Manufacturer).Include(x=>x.PhoneSpecification).ToList();
            
    }

    public void AddSmartphone(Smartphone smartphone)
    {
        smartphonesDbContext.Phones.Add(smartphone);
        smartphonesDbContext.SaveChanges();
    }

    public bool UpdateSmartphone(int id, Smartphone smartphone)
    {
        var existingSmartphone = smartphonesDbContext.Phones.FirstOrDefault(p => p.Id == id);
        if (existingSmartphone != null)
        {
            existingSmartphone.Name = smartphone.Name;
            existingSmartphone.Description = smartphone.Description;
            smartphonesDbContext.SaveChanges();
            return true;
        }
        return false;
    }

    public bool DeleteSmartphone(int id)
    {
        var existingSmartphone = smartphonesDbContext.Phones.FirstOrDefault(p => p.Id == id);
        smartphonesDbContext.Phones.Remove(existingSmartphone);
        smartphonesDbContext.SaveChanges();
        return true;
    }

    public List<Smartphone> SearchByManufacturer(string name)
    {
        return smartphonesDbContext.Phones.Include(x=>x.Manufacturer).Include(x=>x.PhoneSpecification).Where(p=>p.Manufacturer.ManufacturerName.Contains(name)).ToList();
    }

    public List<Smartphone> SearchBySpecification(PhoneSpecification spec)
    {
        return smartphonesDbContext.Phones
            .Include(x => x.Manufacturer)
            .Include(x => x.PhoneSpecification)
            .Where(p =>
                (spec.OS == null || p.PhoneSpecification.OS.Contains(spec.OS)) ||
                (spec.RAM == null || p.PhoneSpecification.RAM.Contains(spec.RAM)) ||
                (spec.Storage == null || p.PhoneSpecification.Storage.Contains(spec.Storage)) ||
                (spec.Processor == null || p.PhoneSpecification.Storage.Contains(spec.Processor))
    )
    .ToList();
    }

}