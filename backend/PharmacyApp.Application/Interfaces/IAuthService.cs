using PharmacyApp.Core.Entities;
using PharmacyApp.Application.DTOs;
using System.Threading.Tasks;

namespace PharmacyApp.Application.Interfaces
{
    public interface IAuthService
    {
        Task<RegisterResult> Register(RegisterDto dto);              // returns new UserId
        Task<LoginResponseDto?> Login(string username, string password); // includes JWT & IsVerified
        Task MarkUserAsVerified(int userId);                         // sets IsVerified = true
        Task<User?> GetUserById(int id);
        Task<User?> UpdateUser(int id, string? newUsername, string? newPassword);
        Task<ServiceResult> DeleteUser(int id);
    }
}
