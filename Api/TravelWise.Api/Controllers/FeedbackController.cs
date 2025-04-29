using Microsoft.AspNetCore.Mvc;
using TravelWise.Model.Entities;
using TravelWise.Model.Entities.Dtos;

namespace TravelWise.Api.Controllers;
[ApiController]
[Route("/api/[controller]")]
public class FeedbackController
{
    [HttpGet]
    [Route("ReceiveFeedback")]
    public async Task<Feedback> ReceiveFeedback(FeedbackDto dto)
    {
        return new Feedback();
    }
}