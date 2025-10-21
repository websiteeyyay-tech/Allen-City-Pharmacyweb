using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;

namespace PharmacyApp.Core.Services
{
    public class AuthService : IAuthService
    {
        private readonly List<User> _users = new();

        public User Register(User user)
        {
            user.Id = _users.Count + 1;
            _users.Add(user);
            return user;
        }

        public User? Login(string username, string password)
        {
            return _users.FirstOrDefault(u => 
                u.Username.Equals(username, StringComparison.OrdinalIgnoreCase) &&
                u.PasswordHash == password);
        }
    }
}
