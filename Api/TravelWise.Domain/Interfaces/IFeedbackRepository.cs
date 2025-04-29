using TravelWise.Model.Entities;
using TravelWise.Model.Entities.Dtos;

namespace TravelWise.Domain.Interfaces;

public interface IFeedbackRepository : IRepository<Feedback>
{
    Task<Feedback> ReceiveFeedback(FeedbackDto dto);
}