using Godlin.Phone.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Godlin.Phone.API.Context;

public class SmartPhonesDbContext: IdentityDbContext<IdentityUser>
{
    
    public SmartPhonesDbContext(DbContextOptions options):base(options)
    {
        
        
    }
    public DbSet<Smartphone> Phones { get; set; }
    
    public DbSet<Manufacturer> Manufacturers { get; set; }
    
    public DbSet<PhoneSpecification> PhoneSpecifications { get; set; }
    
}