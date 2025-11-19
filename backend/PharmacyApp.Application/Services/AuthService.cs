using BCrypt.Net;
using PharmacyApp.Application.DTOs;
using PharmacyApp.Application.Interfaces;
using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;
using System.Threading.Tasks;

namespace PharmacyApp.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtService _jwtService;

        public AuthService(IUserRepository userRepository, IJwtService jwtService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }

        public async Task<RegisterResult> Register(RegisterDto dto)
        {
            var existing = await _userRepository.GetByUsernameAsync(dto.Username);
            if (existing != null) return RegisterResult.Failed("Username already exists.");

            var user = new User
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "User",
                IsVerified = false
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            return RegisterResult.Ok(user.Id);
        }

        public async Task<LoginResponseDto?> Login(string username, string password)
        {
            var user = await _userRepository.GetByUsernameAsync(username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash)) return null;

            if (!user.IsVerified)
            {
                return new LoginResponseDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Role = user.Role,
                    Token = string.Empty,
                    IsVerified = false
                };
            }

            var token = _jwtService.GenerateToken(user.Id, user.Username, user.Role);

            return new LoginResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role,
                Token = token,
                IsVerified = true
            };
        }

        public async Task MarkUserAsVerified(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return;

            user.IsVerified = true;
            await _userRepository.UpdateAsync(user);
            await _userRepository.SaveChangesAsync();
        }

        public async Task<User?> UpdateUser(int id, string? newUsername, string? newPassword)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return null;

            if (!string.IsNullOrWhiteSpace(newUsername))
            {
                var existing = await _userRepository.GetByUsernameAsync(newUsername);
                if (existing != null && existing.Id != id) throw new Exception("Username is already taken.");
                user.Username = newUsername;
            }

            if (!string.IsNullOrWhiteSpace(newPassword)) user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);

            await _userRepository.UpdateAsync(user);
            await _userRepository.SaveChangesAsync();
            return user;
        }

        public async Task<User?> GetUserById(int id) => await _userRepository.GetByIdAsync(id);

        public async Task<ServiceResult> DeleteUser(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return ServiceResult.Failed("User not found.");

            await _userRepository.DeleteAsync(user);
            await _userRepository.SaveChangesAsync();
            return ServiceResult.SuccessResult();
        }
    }
}
