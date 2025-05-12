namespace TravelWise.Model.Entities.Dtos;

public class FeedbackDto
{
    public int Rating { get; set; }
    public string? Comment { get; set; }

    public string UserId { get; set; }  // Vom angemeldeten Nutzer
    public Guid TripId { get; set; }  // Die Reise, die bewertet wird
}