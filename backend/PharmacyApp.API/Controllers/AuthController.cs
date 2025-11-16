using Microsoft.AspNetCore.Mvc;
<<<<<<< HEAD
using PharmacyApp.Application.DTOs;
using PharmacyApp.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
=======
using PharmacyApp.Core.Entities;
using PharmacyApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
>>>>>>> 3e6e73fd46f59ecdbbdbecf874688b93caa9d256

namespace PharmacyApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
<<<<<<< HEAD
        private readonly IAuthService _authService;
        private readonly IEmailVerificationService _emailVerificationService;

        public AuthController(
            IAuthService authService,
            IEmailVerificationService emailVerificationService)
        {
            _authService = authService;
            _emailVerificationService = emailVerificationService;
        }

        // -----------------------------
        // REGISTER
        // -----------------------------
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.Register(dto);

            if (!result.Success)
                return BadRequest(new { message = result.ErrorMessage });

            // Send email verification code
            var code = await _emailVerificationService.GenerateCodeAsync(result.UserId);
            // TODO: Send 'code' via SMTP (or 3rd party email service)

            return Ok(new
            {
                message = "Registration successful! Please check your email to verify your account.",
                userId = result.UserId
            });
        }

        // -----------------------------
        // VERIFY EMAIL
        // -----------------------------
        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDto dto)
        {
            bool isValid = await _emailVerificationService.VerifyCodeAsync(dto.UserId, dto.Code);
            if (!isValid)
                return BadRequest(new { message = "Invalid or expired code." });

            await _authService.MarkUserAsVerified(dto.UserId);

            return Ok(new { message = "Email verified successfully!" });
        }

        // -----------------------------
        // LOGIN (returns JWT)
        // -----------------------------
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _authService.Login(dto.Username, dto.Password);

            if (response == null)
                return Unauthorized(new { message = "Invalid username or password." });

            if (!response.IsVerified)
                return Unauthorized(new { message = "Please verify your email before logging in." });
=======
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
>>>>>>> 3e6e73fd46f59ecdbbdbecf874688b93caa9d256

            return Ok(new
            {
                message = "Login successful!",
                user = new
                {
<<<<<<< HEAD
                    response.Id,
                    response.Username,
                    response.Role
                },
                token = response.Token
            });
        }

        // -----------------------------
        // DELETE USER (Admin only)
        // -----------------------------
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _authService.DeleteUser(id);

            if (!result.Success)
                return NotFound(new { message = result.ErrorMessage });

            return Ok(new { message = $"User with ID {id} has been deleted successfully." });
        }

        // -----------------------------
        // UPDATE USER
        // -----------------------------
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _authService.UpdateUser(id, dto.NewUsername, dto.NewPassword);

            if (user == null)
                return NotFound(new { message = "User not found." });

            return Ok(new
            {
                message = "User updated successfully!",
                user = new { user.Id, user.Username, user.Role }
            });
=======
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
>>>>>>> 3e6e73fd46f59ecdbbdbecf874688b93caa9d256
        }
    }
}
