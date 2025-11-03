using PharmacyApp.Core.Entities;
using System.Threading.Tasks;

namespace PharmacyApp.Core.Interfaces
{
    public interface IAuthService
    {
        Task<User?> GetUserByUsername(string username);
        Task<User?> GetUserById(int id);
        Task<User> Register(User user);
        Task<User?> Login(string username, string password);
        Task<User?> UpdateUser(int id, string? username, string? password);
        Task DeleteUser(int id);
    }
}
