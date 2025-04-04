using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using TravelWise.Bl.Interfaces;
using User = TravelWise.Model.Entities.User;

namespace TravelWise.Bl.Services;

public class TokenManagerService(IConfiguration config) : ITokenManagerService
{
    private readonly SymmetricSecurityKey _key = new(Encoding.UTF8.GetBytes(config.GetSection("Jwt:Key").Get<string>()!));
    private readonly JwtSecurityTokenHandler _tokenHandler = new();

    public string GenerateJwtToken(User user)
    {
        var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Name, user.UserName!),
        };
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds);

        return _tokenHandler.WriteToken(token);
    }
}