using System.Collections.Generic;
using System.Threading.Tasks;
using PharmacyApp.Core.Entities;

namespace PharmacyApp.Core.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(int id);
        Task<Product> CreateAsync(Product product);
        Task UpdateAsync(Product product);
        Task DeleteAsync(int id);
    }
}
