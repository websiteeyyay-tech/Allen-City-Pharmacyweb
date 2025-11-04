using Microsoft.AspNetCore.Mvc;
using PharmacyApp.Core.Entities;
using PharmacyApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace PharmacyApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly PharmacyDbContext _context;

        public AuthController(PharmacyDbContext context)
        {
            _context = context;
        }

        // ✅ REGISTER
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (user == null || string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.PasswordHash))
                return BadRequest(new { message = "Invalid registration data." });

            // Check if username already exists
            if (await _context.Users.AnyAsync(u => u.Username == user.Username))
                return Conflict(new { message = "Username already exists. Please choose another one." });

            // Hash password before saving
            user.PasswordHash = HashPassword(user.PasswordHash);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful!", user = new { user.Id, user.Username, user.Role } });
        }

        // ✅ LOGIN
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User user)
        {
            if (user == null)
                return BadRequest(new { message = "Invalid login data." });

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == user.Username);
            if (existingUser == null)
                return Unauthorized(new { message = "Invalid username or password." });

            if (!VerifyPassword(user.PasswordHash, existingUser.PasswordHash))
                return Unauthorized(new { message = "Invalid username or password." });

            return Ok(new
            {
                message = "Login successful!",
                user = new
                {
                    existingUser.Id,
                    existingUser.Username,
                    existingUser.Role
                }
            });
        }

        // ✅ DELETE USER
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found." });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"User with ID {id} deleted successfully." });
        }

        // ✅ UPDATE USER
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found." });

            if (!string.IsNullOrEmpty(dto.NewUsername))
                user.Username = dto.NewUsername;

            if (!string.IsNullOrEmpty(dto.NewPassword))
                user.PasswordHash = HashPassword(dto.NewPassword);

            await _context.SaveChangesAsync();
            return Ok(new { message = "User updated successfully.", user });
        }

        // 🔒 Simple password hashing
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        private bool VerifyPassword(string inputPassword, string storedHash)
        {
            var hash = HashPassword(inputPassword);
            return hash == storedHash;
        }

        // DTO
        public class UpdateUserDto
        {
            public string? NewUsername { get; set; }
            public string? NewPassword { get; set; }
        }
    }
}
