using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;
using PharmacyApp.Application.Interfaces;
using System;
using System.Threading.Tasks;

namespace PharmacyApp.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;

        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<User?> Login(string username, string password)
        {
            var user = await _userRepository.GetByUsernameAsync(username);
            if (user == null || user.PasswordHash != password)
                return null;

            return user;
        }

        public async Task<User?> GetUserByUsername(string username)
        {
            return await _userRepository.GetByUsernameAsync(username);
        }

        public async Task<User?> GetUserById(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<User> Register(User user)
        {
            var existingUser = await _userRepository.GetByUsernameAsync(user.Username);
            if (existingUser != null)
                throw new Exception("Username already exists.");

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();
            return user;
        }

        // ✅ FIXED HERE
public async Task DeleteUser(int id)
{
    var user = await _userRepository.GetByIdAsync(id);
    if (user == null)
        throw new Exception("User not found.");

    await _userRepository.DeleteAsync(user);   // ✅ pass the User object
    await _userRepository.SaveChangesAsync();  // ✅ commit changes
}

        public async Task<User?> UpdateUser(int id, string? newUsername, string? newPassword)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                return null;

            if (!string.IsNullOrEmpty(newUsername))
                user.Username = newUsername;

            if (!string.IsNullOrEmpty(newPassword))
                user.PasswordHash = newPassword;

            await _userRepository.UpdateAsync(user);
            await _userRepository.SaveChangesAsync();

            return user;
        }
    }
}
