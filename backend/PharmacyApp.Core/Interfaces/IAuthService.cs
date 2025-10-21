using PharmacyApp.Core.Entities;

namespace PharmacyApp.Core.Interfaces
{
    public interface IAuthService
    {
        User? Login(string username, string password);
        User Register(User user);
    }
}
