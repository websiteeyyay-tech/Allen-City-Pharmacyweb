using PharmacyApp.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PharmacyApp.Core.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(int id);
        Task AddAsync(Product product);
        Task UpdateAsync(Product product);
        Task DeleteAsync(Product product);
        Task SaveChangesAsync();
    }
}
