using PharmacyApp.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PharmacyApp.Core.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(int id);
        Task<Product> CreateAsync(Product product); // ✅ returns Product
        Task UpdateAsync(Product product);
        Task DeleteAsync(int id);
    }
}
