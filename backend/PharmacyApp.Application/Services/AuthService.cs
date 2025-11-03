using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;
using System.Threading.Tasks;

namespace PharmacyApp.Application.Services
{
    public class AuthService : IAuthService
    {
        public async Task<User?> GetUserByUsername(string username)
        {
            // TODO: implement actual database query here
            return await Task.FromResult<User?>(null);
        }

        public async Task<User?> GetUserById(int id)
        {
            // TODO: implement actual database query here
            return await Task.FromResult<User?>(null);
        }

        public async Task<User> Register(User user)
        {
            // TODO: add database insert logic here
            return await Task.FromResult(user);
        }

        public async Task<User?> Login(string username, string password)
        {
            // TODO: validate login credentials here
            return await Task.FromResult<User?>(null);
        }

        public async Task<User?> UpdateUser(int id, string? username, string? password)
        {
            // TODO: implement update logic and return updated user or null
            return await Task.FromResult<User?>(null);
        }

        public async Task DeleteUser(int id)
        {
            // TODO: implement delete logic
            await Task.CompletedTask;
        }
    }
}
