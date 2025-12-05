using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Godlin.Phone.API.Models;

public class Manufacturer
{
    [Key]
    public int ManufacturerId { get; set; }
    [Required]
    [StringLength(50)]
    public string ManufacturerName { get; set; }
    
    [JsonIgnore]
    public ICollection<Smartphone>? Phones { get; set; }
}