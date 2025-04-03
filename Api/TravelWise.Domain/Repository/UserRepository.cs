using Microsoft.EntityFrameworkCore;
using StockWise.Domain.Interfaces;
using StockWise.Model.Entities;
using TravelWise.Domain.Interfaces;
using TravelWise.Domain.Repository;
using TravelWise.Model.Configuration;
using TravelWise.Model.Entities;

// Für ToListAsync

namespace StockWise.Domain.Repositories;

public class UserRepository(TravelWiseContext context) : ARepository<User>(context), IUserRepository
{
    public async Task<User?> GetUserById(string id)
    {
        return await Table
            .FirstOrDefaultAsync(s => s.Id == id); 
    }
}