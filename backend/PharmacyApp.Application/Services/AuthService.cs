using BCrypt.Net;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PharmacyApp.Application.DTOs;
using PharmacyApp.Application.Interfaces;
using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace PharmacyApp.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _config;

        public AuthService(IUserRepository userRepository, IConfiguration config)
        {
            _userRepository = userRepository;
            _config = config;
        }

        // -----------------------------
        // REGISTER
        // -----------------------------
        public async Task<RegisterResult> Register(RegisterDto dto)
        {
            var existing = await _userRepository.GetByUsernameAsync(dto.Username);
            if (existing != null)
                return RegisterResult.Failed("Username already exists.");

            var user = new User
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "User",
                IsVerified = false
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            return RegisterResult.Success(user.Id);
        }

        // -----------------------------
        // LOGIN (returns JWT + user info)
        // -----------------------------
        public async Task<LoginResponseDto?> Login(string username, string password)
        {
            var user = await _userRepository.GetByUsernameAsync(username);
            if (user == null) return null;

            bool passwordMatches = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            if (!passwordMatches) return null;

            // Prevent login if email not verified
            if (!user.IsVerified) return new LoginResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role,
                Token = string.Empty,
                IsVerified = false
            };

            var token = GenerateJwtToken(user);

            return new LoginResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role,
                Token = token,
                IsVerified = true
            };
        }

        // -----------------------------
        // MARK USER AS VERIFIED
        // -----------------------------
        public async Task MarkUserAsVerified(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return;

            user.IsVerified = true;

            await _userRepository.UpdateAsync(user);
            await _userRepository.SaveChangesAsync();
        }

        // -----------------------------
        // GET USER BY ID
        // -----------------------------
        public async Task<User?> GetUserById(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        // -----------------------------
        // DELETE USER
        // -----------------------------
        public async Task<ServiceResult> DeleteUser(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                return ServiceResult.Failed("User not found.");

            await _userRepository.DeleteAsync(user);
            await _userRepository.SaveChangesAsync();

            return ServiceResult.Success();
        }

        // -----------------------------
        // UPDATE USER
        // -----------------------------
        public async Task<User?> UpdateUser(int id, string? newUsername, string? newPassword)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return null;

            if (!string.IsNullOrWhiteSpace(newUsername))
                user.Username = newUsername;

            if (!string.IsNullOrWhiteSpace(newPassword))
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);

            await _userRepository.UpdateAsync(user);
            await _userRepository.SaveChangesAsync();

            return user;
        }

        // -----------------------------
        // JWT GENERATION HELPER
        // -----------------------------
        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _config.GetSection("JwtSettings");
            var key = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim("id", user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpiryMinutes"])),
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    // -----------------------------
    // LOGIN RESPONSE DTO
    // -----------------------------
    public class LoginResponseDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Role { get; set; } = "User";
        public string Token { get; set; } = string.Empty;
        public bool IsVerified { get; set; } = false;
    }

    // -----------------------------
    // REGISTER RESULT DTO
    // -----------------------------
    public class RegisterResult
    {
        public bool Success { get; private set; }
        public string? ErrorMessage { get; private set; }
        public int UserId { get; private set; }

        public static RegisterResult Success(int userId) =>
            new RegisterResult { Success = true, UserId = userId };

        public static RegisterResult Failed(string message) =>
            new RegisterResult { Success = false, ErrorMessage = message };
    }

    // -----------------------------
    // SERVICE RESULT HELPER
    // -----------------------------
    public class ServiceResult
    {
        public bool Success { get; private set; }
        public string? ErrorMessage { get; private set; }

        public static ServiceResult Success() =>
            new ServiceResult { Success = true };

        public static ServiceResult Failed(string message) =>
            new ServiceResult { Success = false, ErrorMessage = message };
    }
}
