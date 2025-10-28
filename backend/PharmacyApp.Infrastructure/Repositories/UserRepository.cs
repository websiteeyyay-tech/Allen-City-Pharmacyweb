using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;
using PharmacyApp.Infrastructure.Data;

namespace PharmacyApp.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly PharmacyDbContext _context;

        public UserRepository(PharmacyDbContext context) // ✅ fixed constructor name
        {
            _context = context;
        }

        public User? GetById(int id)
        {
            return _context.Users.FirstOrDefault(u => u.Id == id);
        }

        public User? GetByUsername(string username)
        {
            return _context.Users.FirstOrDefault(u => u.Username == username);
        }

        public void Add(User user)
        {
            _context.Users.Add(user);
        }

        public void Delete(User user)
        {
            _context.Users.Remove(user);
        }

        public void Update(User user)
        {
            _context.Users.Update(user);
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }
    }
}
