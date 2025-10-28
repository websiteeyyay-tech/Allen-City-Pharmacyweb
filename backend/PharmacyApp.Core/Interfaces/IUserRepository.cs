using PharmacyApp.Core.Entities;

namespace PharmacyApp.Core.Interfaces
{
    public interface IUserRepository
    {
        User? GetById(int id);
        User? GetByUsername(string username);
        void Add(User user);
        void Delete(User user);
        void SaveChanges();
        void Update(User user);
    }
}
