using Microsoft.AspNetCore.Mvc;
using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;
using PharmacyApp.Application.Interfaces;

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

        // ✅ Register endpoint
        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            if (user == null)
                return BadRequest(new { message = "Invalid user data." });

            var existingUser = _authService.GetUserByUsername(user.Username);
            if (existingUser != null)
                return Conflict(new { message = "Username already exists. Please choose another one." });

            var newUser = _authService.Register(user);
            if (newUser == null)
                return StatusCode(500, new { message = "User registration failed." });

            return Ok(new { message = "Registration successful!", user = newUser });
        }

        // ✅ Login endpoint
        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            if (user == null)
                return BadRequest(new { message = "Invalid user data." });

            var loggedUser = _authService.Login(user.Username, user.PasswordHash);
            if (loggedUser == null)
                return Unauthorized(new { message = "Invalid username or password." });

            return Ok(new { message = "Login successful!", user = loggedUser });
        }

        // ✅ Delete user endpoint
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            var existingUser = _authService.GetUserById(id);
            if (existingUser == null)
                return NotFound(new { message = $"User with ID {id} not found." });

            _authService.DeleteUser(id);
            return Ok(new { message = $"User with ID {id} has been deleted successfully." });
        }
        // ✅ Update user endpoint
        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] UpdateUserDto dto)
        {
            try
            {
                var updatedUser = _authService.UpdateUser(id, dto.NewUsername, dto.NewPassword);
                return Ok(updatedUser);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        public class UpdateUserDto
        {
            public string? NewUsername { get; set; }
            public string? NewPassword { get; set; }
        }

    }
}
