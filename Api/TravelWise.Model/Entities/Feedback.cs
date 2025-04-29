namespace TravelWise.Model.Entities;

public class Feedback
{
    public int Id { get; set; }
    public int Rating { get; set; } // 1-10
    public string? Comment { get; set; } // Optional
    public DateTime CreatedAt { get; set; }

    // Beziehungen
    public string UserId { get; set; }
    public User User { get; set; }

    public Guid TripId { get; set; }
    public Trip Trip { get; set; }
}
