using Godlin.Phone.API.Context;
using Godlin.Phone.API.Migrations;
using Godlin.Phone.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Godlin.Phone.API.Repositories.ManufacturerRepo;

public class ManufacturerRepository: IManufacturerRepository
{
    SmartPhonesDbContext smartPhonesDbContext;
    
    public ManufacturerRepository(SmartPhonesDbContext smartPhonesDbContext)
    {
        this.smartPhonesDbContext = smartPhonesDbContext;
    }
    
    public void AddManufacturer(Manufacturer manufacturer)
    {
        smartPhonesDbContext.Manufacturers.Add(manufacturer);
        smartPhonesDbContext.SaveChanges();
    }

    private readonly List<Manufacturer> manufacturers;
    
    public List<Manufacturer> GetAllManufacturers()
    {
        return smartPhonesDbContext.Manufacturers.Include(p=>p.Phones).ToList();
    }
    
    

    public bool UpdateManufacturer(int id, Manufacturer manufacturer)
    {
        var existingManufacturer = smartPhonesDbContext.Manufacturers.FirstOrDefault(p=>p.ManufacturerId == id);
        if (existingManufacturer != null)
        {
            existingManufacturer.ManufacturerName = manufacturer.ManufacturerName;
            smartPhonesDbContext.SaveChanges();
            return true;
        }
        return false;
    }

    public bool DeleteManufacturer(int id)
    {
        var existingManufacturer = smartPhonesDbContext.Manufacturers.FirstOrDefault(p => p.ManufacturerId == id);
        smartPhonesDbContext.Manufacturers.Remove(existingManufacturer);
        smartPhonesDbContext.SaveChanges();
        return true;
    }

    public Manufacturer GetManufacturer(int id)
    {
        return smartPhonesDbContext.Manufacturers.FirstOrDefault(s => s.ManufacturerId == id);
    }
    
}