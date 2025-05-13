using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TravelWise.Bl.Interfaces;
using TravelWise.Model.Entities;
using TravelWise.Model.Entities.Dtos;

namespace TravelWise.Api.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class IdentityController(
    UserManager<User> userManager,
    SignInManager<User> signInManager,
    ITokenManagerService tokenManagerService
)
    : ControllerBase
{
    [HttpPost]
    [Route("Register")]
    public async Task<IActionResult> Post([FromBody] UserRegisterDto registerRequest)
    {
        # region init user

        var user = new User
        {
            UserName = registerRequest.UserName,
            Email = registerRequest.Email
        };

        if (userManager.Users.Any(u => u.Email == registerRequest.Email)) return BadRequest(new { message = "Email already exists" });
        var result = await userManager.CreateAsync(user, registerRequest.Password);

        if (result.Succeeded)
        {
            user = await userManager.FindByEmailAsync(registerRequest.Email);
            var token = tokenManagerService.GenerateJwtToken(user!);
            return Ok(new { token });
        }

        var errorObject = new
        {
            Errors = result.Errors.Select(e => new
            {
                e.Code, e.Description
            })
        };

        # endregion

        return BadRequest(errorObject);
    }

    [HttpPost]
    [Route("Login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto loginRequest)
    {
        var user = await userManager.FindByEmailAsync(loginRequest.Email);

        if (user == null) return BadRequest(new { message = "Invalid login attempt" });
        var result = await signInManager.PasswordSignInAsync(user.UserName!, loginRequest.Password, false, true);

        if (!result.Succeeded) return BadRequest(new { message = "Invalid login attempt" });
        var token = tokenManagerService.GenerateJwtToken(user);

        return Ok(new { token });
    }

    [HttpGet]
    [Route("Test")]
    [Authorize]
    public IActionResult Get()
    {
        return Ok(new { message = "Hello from IdentityController" });
    }

    [HttpGet]
    [Route("GetUser")]
    [Authorize]
    public async Task<IActionResult> GetUser()
    {
        var user = await userManager.GetUserAsync(User);
        var userDto = new UserDto
        {
            Email = user!.Email!,
            UserName = user.UserName!
        };
        return Ok(userDto);
    }
}