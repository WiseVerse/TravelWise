
using StockWise.Model.Entities;
using TravelWise.Domain.Interfaces;

namespace StockWise.Domain.Interfaces;

public interface IUserRepository: IRepository<User>
{
    Task<User?> GetUserById(string id);
    
}