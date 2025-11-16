using Microsoft.AspNetCore.Mvc;
using PharmacyApp.Application.DTOs;
using PharmacyApp.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System;

namespace PharmacyApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IEmailVerificationService _emailVerificationService;

        public AuthController(IAuthService authService, IEmailVerificationService emailVerificationService)
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

            try
            {
                var result = await _authService.Register(dto);
                if (!result.Success)
                    return BadRequest(new { message = result.ErrorMessage });

                // Generate & send email verification code
                var code = await _emailVerificationService.GenerateCodeAsync(result.UserId);
                // TODO: send 'code' via SMTP

                return Ok(new
                {
                    message = "Registration successful! Check your email to verify your account.",
                    userId = result.UserId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        // -----------------------------
        // VERIFY EMAIL
        // -----------------------------
        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDto dto)
        {
            try
            {
                var isValid = await _emailVerificationService.VerifyCodeAsync(dto.UserId, dto.Code);
                if (!isValid)
                    return BadRequest(new { message = "Invalid or expired verification code." });

                await _authService.MarkUserAsVerified(dto.UserId);
                return Ok(new { message = "Email verified successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        // -----------------------------
        // LOGIN (returns JWT + redirect info)
        // -----------------------------
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var response = await _authService.Login(dto.Username, dto.Password);
                if (response == null)
                    return Unauthorized(new { message = "Invalid username or password." });

                if (!response.IsVerified)
                    return Unauthorized(new { message = "Please verify your email before logging in." });

                // Return redirect URL for frontend to handle navigation
                var redirectUrl = response.Role == "Admin" ? "/admin/dashboard" : "/dashboard";

                return Ok(new
                {
                    message = "Login successful!",
                    user = new { response.Id, response.Username, response.Role },
                    token = response.Token,
                    redirectUrl
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        // -----------------------------
        // LOGOUT
        // -----------------------------
        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // JWT is stateless; instruct frontend to remove token
            return Ok(new { message = "Logout successful. Remove token on client side." });
        }

        // -----------------------------
        // DELETE USER (Admin only)
        // -----------------------------
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var result = await _authService.DeleteUser(id);
                if (!result.Success)
                    return NotFound(new { message = result.ErrorMessage });

                return Ok(new { message = $"User with ID {id} deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
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

            try
            {
                var user = await _authService.UpdateUser(id, dto.NewUsername, dto.NewPassword);
                if (user == null)
                    return NotFound(new { message = "User not found." });

                return Ok(new
                {
                    message = "User updated successfully!",
                    user = new { user.Id, user.Username, user.Role }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }
    }
}
