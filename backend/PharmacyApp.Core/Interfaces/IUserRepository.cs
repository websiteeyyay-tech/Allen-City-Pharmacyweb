using PharmacyApp.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PharmacyApp.Core.Interfaces
{
    public interface IUserRepository
    {
        // 🔍 Basic CRUD
        Task<IEnumerable<User>> GetAllAsync();
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByUsernameAsync(string username);

        Task AddAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(User user);

        Task SaveChangesAsync();
    }
}
