using Microsoft.AspNetCore.Mvc;
using PharmacyApp.Application.DTOs;
using PharmacyApp.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

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

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _authService.Register(dto);
            if (!result.Success) return BadRequest(new { message = result.ErrorMessage });

            var code = await _emailVerificationService.GenerateCodeAsync(result.UserId);
            // TODO: send email with code

            return Ok(new { message = "Registration successful!", userId = result.UserId });
        }

        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var isValid = await _emailVerificationService.VerifyCodeAsync(dto.UserId, dto.Code);
            if (!isValid) return BadRequest(new { message = "Invalid or expired verification code." });

            await _authService.MarkUserAsVerified(dto.UserId);
            return Ok(new { message = "Email verified successfully!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var response = await _authService.Login(dto.Username, dto.Password);
            if (response == null) return Unauthorized(new { message = "Invalid username or password." });

            if (!response.IsVerified) return Unauthorized(new { message = "Please verify your email." });

            return Ok(new
            {
                message = "Login successful!",
                user = new { response.Id, response.Username, response.Role },
                token = response.Token
            });
        }

        [Authorize]
[HttpPut("{id}")]
public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
{
    if (!ModelState.IsValid) return BadRequest(ModelState);

    // Ensure nulls are passed as nullables
    var user = await _authService.UpdateUser(
        id,
        dto.NewUsername ?? null,
        dto.NewPassword ?? null
    );

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
