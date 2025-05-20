using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TravelWise.Model.Entities;

public class Feedback
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    //public string Id2 { get; set; } = Guid.NewGuid().ToString();
    public int Rating { get; set; } // 1-10
    public string? Comment { get; set; } // Optional
    public DateTime CreatedAt { get; set; }

    // Beziehungen
    public string UserId { get; set; }
    public User User { get; set; }

}
