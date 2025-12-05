using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Godlin.Phone.API.Models;

public class Smartphone
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Name { get; set; }
    
    public string Description { get; set; }
    
    public int ManufacturerId { get; set; }
    
    [ForeignKey("ManufacturerId")]
    public Manufacturer? Manufacturer { get; set; }
    
    public int SpecId { get; set; }
    [ForeignKey("SpecId")]
    public PhoneSpecification? PhoneSpecification { get; set; }
    
}