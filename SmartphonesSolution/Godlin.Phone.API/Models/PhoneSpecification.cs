using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Godlin.Phone.API.Models;

public class PhoneSpecification
{
    [Key]
    public int SpecId { get; set; }
    
    public string Processor { get; set; }
    
    public string RAM { get; set; }
    
    public string Storage { get; set; }
    
    public string OS { get; set; }
    
    [JsonIgnore]
    public ICollection<Smartphone>? Phones { get; set; }
}