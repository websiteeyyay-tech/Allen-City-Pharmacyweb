using PharmacyApp.Application.DTOs;
using PharmacyApp.Core.Entities;
using System.Threading.Tasks;

namespace PharmacyApp.Application.Interfaces
{
    public interface IAuthService
    {
        Task<RegisterResult> Register(RegisterDto dto);
        Task<LoginResponseDto?> Login(string username, string password);
        Task MarkUserAsVerified(int userId);
        Task<ServiceResult> DeleteUser(int id);
        Task<User?> UpdateUser(int id, string newUsername, string newPassword);
        Task<User?> GetUserById(int id); // Optional, if you want to expose fetching users
    }
}
