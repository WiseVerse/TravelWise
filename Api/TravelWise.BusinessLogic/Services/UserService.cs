using StockWise.Bl.Interfaces;
using StockWise.Domain.Interfaces;
using StockWise.Model.Entities;

namespace StockWise.Bl.Services;

public class UserService(IUserRepository repository)
    : AService<User>(repository), IUserService
{

    public Task<User> GetUserById(string Id)
    {
        return ((IUserRepository) Repository).GetUserById(Id);
    }
}
