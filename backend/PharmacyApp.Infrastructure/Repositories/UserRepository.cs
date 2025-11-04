using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;
using PharmacyApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PharmacyApp.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly PharmacyDbContext _context;

        public UserRepository(PharmacyDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
            => await _context.Users.ToListAsync();

        public async Task<User?> GetByIdAsync(int id)
            => await _context.Users.FindAsync(id);

        public async Task<User?> GetByUsernameAsync(string username)
            => await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

        public async Task AddAsync(User user)
            => await _context.Users.AddAsync(user);

        public async Task UpdateAsync(User user)
            => _context.Users.Update(user);

        public async Task DeleteAsync(User user)
{
    _context.Users.Remove(user);
    await _context.SaveChangesAsync();
}

        public async Task SaveChangesAsync()
            => await _context.SaveChangesAsync();
    }
}
