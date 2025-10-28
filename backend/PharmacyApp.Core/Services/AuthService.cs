using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace PharmacyApp.Core.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;

        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // ✅ Get user by username
        public User? GetUserByUsername(string username)
        {
            return _userRepository.GetByUsername(username);
        }

        // ✅ Get user by ID
        public User? GetUserById(int id)
        {
            return _userRepository.GetById(id);
        }

        // ✅ Register new user (only if not exists)
        public User Register(User user)
        {
            if (_userRepository.GetByUsername(user.Username) != null)
                throw new Exception("Username already exists.");

            // Hash password before saving
            user.PasswordHash = HashPassword(user.PasswordHash);

            _userRepository.Add(user);
            _userRepository.SaveChanges();

            return user;
        }

        // ✅ Login existing user
        public User? Login(string username, string password)
        {
            var existingUser = _userRepository.GetByUsername(username);
            if (existingUser == null)
                return null;

            var hashedPassword = HashPassword(password);
            return existingUser.PasswordHash == hashedPassword ? existingUser : null;
        }

        // ✅ Delete user by ID
        public void DeleteUser(int id)
        {
            var user = _userRepository.GetById(id);
            if (user != null)
            {
                _userRepository.Delete(user);
                _userRepository.SaveChanges();
            }
        }

        // 🔒 Hash password helper
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(bytes).Replace("-", "").ToLower();
        }
        // ✅ Update user details
        public User? UpdateUser(int id, string? newUsername, string? newPassword)
        {
            var user = _userRepository.GetById(id);
            if (user == null)
                return null;

            if (!string.IsNullOrEmpty(newUsername))
                user.Username = newUsername;

            if (!string.IsNullOrEmpty(newPassword))
                user.PasswordHash = HashPassword(newPassword);

            _userRepository.Update(user);
            _userRepository.SaveChanges();

            return user;
        }

    }
}
