namespace TravelWise.Model.Entities;
using System;

public class TripLocation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TripId { get; set; }
    public string Name { get; set; } = null!;
    public string GoogleMapsPlaceId { get; set; } = null!;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public DateTime? VisitDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Property
    public Trip Trip { get; set; } = null!;
}
