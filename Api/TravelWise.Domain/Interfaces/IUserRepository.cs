using TravelWise.Model.Entities;

namespace TravelWise.Domain.Interfaces;

public interface IUserRepository: IRepository<User>
{
    Task<User?> GetUserById(string id);
    
}