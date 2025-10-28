using PharmacyApp.Core.Entities;

namespace PharmacyApp.Core.Interfaces
{
    public interface IAuthService
    {
        User? Login(string username, string password);
        User? Register(User user);
        User? GetUserByUsername(string username);
        User? GetUserById(int id);     // ✅ Add this
        User? UpdateUser(int id, string? newUsername, string? newPassword);
        void DeleteUser(int id);       // ✅ Add this
    }
}
