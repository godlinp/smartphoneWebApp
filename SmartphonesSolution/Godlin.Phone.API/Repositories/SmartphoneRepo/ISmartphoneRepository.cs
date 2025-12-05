using Godlin.Phone.API.Models;

namespace Godlin.Phone.API.Repositories.SmartphoneRepo;

public interface ISmartphoneRepository
{
        List<Smartphone> GetAllSmartphones();
        
        void AddSmartphone(Smartphone smartphone);
        
        bool UpdateSmartphone(int id, Smartphone smartphone);
        
        bool DeleteSmartphone(int id);

        List<Smartphone> SearchByManufacturer(string name);

        List<Smartphone> SearchBySpecification(PhoneSpecification spec);

}