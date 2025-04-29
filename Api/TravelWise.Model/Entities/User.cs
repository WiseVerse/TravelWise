using Microsoft.AspNetCore.Identity;

namespace TravelWise.Model.Entities;

public class User: IdentityUser
{
    public ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

}
