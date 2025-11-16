using Microsoft.AspNetCore.Mvc;
using PharmacyApp.Application.DTOs;
using PharmacyApp.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace PharmacyApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
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

            return Ok(new
            {
                message = "Login successful!",
                user = new
                {
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
        }
    }
}
