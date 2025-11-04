using PharmacyApp.Core.Entities;
using System.Threading.Tasks;

namespace PharmacyApp.Application.Interfaces
{
    public interface IAuthService
    {
        Task<User?> Login(string username, string password);
        Task<User?> GetUserByUsername(string username);
        Task<User?> GetUserById(int id);
        Task<User> Register(User user);
        Task<User?> UpdateUser(int id, string? newUsername, string? newPassword);
        Task DeleteUser(int id);
    }
}
