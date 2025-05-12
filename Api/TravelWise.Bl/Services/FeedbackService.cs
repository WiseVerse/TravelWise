using TravelWise.Bl.Interfaces;
using TravelWise.Domain.Interfaces;
using TravelWise.Model.Entities;
using TravelWise.Model.Entities.Dtos;

namespace TravelWise.Bl.Services;

public class FeedbackService(IFeedbackRepository repository) : AService<Feedback>(repository), IFeedbackService
{

    public Task<Feedback?> ReceiveFeedback(FeedbackDto dto)
    {
        return ((IFeedbackRepository)Repository).ReceiveFeedback(dto);
    }


}


