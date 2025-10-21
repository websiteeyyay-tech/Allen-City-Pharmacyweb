using Microsoft.AspNetCore.Mvc;
using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;

namespace PharmacyApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public IActionResult Register(User user)
        {
            var newUser = _authService.Register(user);
            return Ok(newUser);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            var loggedUser = _authService.Login(user.Username, user.PasswordHash);
            if (loggedUser == null)
                return Unauthorized(new { message = "Invalid credentials" });

            return Ok(loggedUser);
        }
    }
}
