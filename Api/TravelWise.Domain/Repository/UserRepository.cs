using Microsoft.EntityFrameworkCore;
using TravelWise.Domain.Interfaces;
using TravelWise.Model.Configuration;
using TravelWise.Model.Entities;

// Für ToListAsync

namespace TravelWise.Domain.Repository;

public class UserRepository(TravelWiseContext context) : ARepository<User>(context), IUserRepository
{
    public async Task<User?> GetUserById(string id)
    {
        return await Table
            .FirstOrDefaultAsync(s => s.Id == id); 
    }
}