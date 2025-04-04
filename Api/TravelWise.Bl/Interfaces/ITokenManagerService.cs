
namespace TravelWise.Bl.Interfaces;

public interface ITokenManagerService
{
    string GenerateJwtToken(TravelWise.Model.Entities.User user);
}