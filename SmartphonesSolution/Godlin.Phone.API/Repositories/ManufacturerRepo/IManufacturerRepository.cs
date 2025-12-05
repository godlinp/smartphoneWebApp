using Godlin.Phone.API.Models;

namespace Godlin.Phone.API.Repositories.ManufacturerRepo;

public interface IManufacturerRepository
{
    void AddManufacturer(Manufacturer manufacturer);
    
     List<Manufacturer> GetAllManufacturers();
     
     bool UpdateManufacturer(int id, Manufacturer manufacturer);
    
     bool DeleteManufacturer(int id);
    
    Manufacturer GetManufacturer(int id);
}