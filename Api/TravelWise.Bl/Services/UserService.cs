using TravelWise.Bl.Interfaces;
using TravelWise.Domain.Interfaces;
using TravelWise.Model.Entities;

namespace TravelWise.Bl.Services;

public class UserService(IUserRepository repository)
    : AService<User>(repository), IUserService
{

    public Task<User> GetUserById(string Id)
    {
        return ((IUserRepository) Repository).GetUserById(Id);
    }
}
