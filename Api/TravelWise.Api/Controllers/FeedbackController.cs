using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TravelWise.Bl.Interfaces;
using TravelWise.Model.Entities;
using TravelWise.Model.Entities.Dtos;

namespace TravelWise.Api.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class FeedbackController(
    IFeedbackService feedbackService,
    UserManager<User> userManager
) : ControllerBase
{
    [HttpPost]
    [Route("ReceiveFeedback")]
    [Authorize]
    public async Task<IActionResult> GetFeedback([FromBody]FeedbackDto feedbackDto)
    {
        var user = await userManager.GetUserAsync(User);
        if (user == null) return Unauthorized();

        var feedback = new Feedback
        {
            Rating = feedbackDto.Rating,
            Comment = feedbackDto.Comment,
            CreatedAt = DateTime.UtcNow,
            UserId = user.Id,
        };
        
        var result = await feedbackService.ReceiveFeedback(feedback);

        return Ok(result);
    }

}