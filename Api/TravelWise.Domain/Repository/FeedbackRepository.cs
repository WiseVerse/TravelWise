using TravelWise.Domain.Interfaces;
using TravelWise.Model.Configuration;
using TravelWise.Model.Entities;
using TravelWise.Model.Entities.Dtos;

namespace TravelWise.Domain.Repository;

public class FeedbackRepository : ARepository<Feedback>, IFeedbackRepository
{
    public FeedbackRepository(TravelWiseContext context) : base(context)
    {
    }

    public async Task<Feedback> ReceiveFeedback(Feedback feedback)
    {
        await Table.AddAsync(feedback);
        await Context.SaveChangesAsync();
        
        return feedback;
    }
}