
using Microsoft.EntityFrameworkCore;

public interface ITokenManagerService
{
    string GenerateJwtToken(TravelWise.Model.Entities.User user);
}