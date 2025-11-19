using PharmacyApp.Application.Interfaces;
using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PharmacyApp.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IGenericRepository<User> _userRepository;

        public UserService(IGenericRepository<User> userRepository)
        {
            _userRepository = userRepository;
        }

        // Get all users
        public async Task<List<User>> GetAllAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return new List<User>(users);
        }

        // Get user by ID
        public async Task<User?> GetByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        // Create a new user
        public async Task<User> CreateAsync(User user)
        {
            await _userRepository.AddAsync(user);
            return user;
        }

        // Update username and password
        public async Task<User?> UpdateAsync(int id, string? newUsername, string? newPassword)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return null;

            if (!string.IsNullOrEmpty(newUsername))
            {
                user.Username = newUsername;
            }

            if (!string.IsNullOrEmpty(newPassword))
            {
                user.PasswordHash = newPassword; // Change to match your User entity
            }

            return user;
        }

        // Delete user
        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return false;

            await _userRepository.DeleteAsync(user.Id);
            return true;
        }
    }
}
