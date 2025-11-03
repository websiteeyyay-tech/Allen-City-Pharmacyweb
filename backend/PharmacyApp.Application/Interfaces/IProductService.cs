using System.Collections.Generic;
using System.Threading.Tasks;
using PharmacyApp.Core.Entities;

namespace PharmacyApp.Application.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(int id);
        Task<Product> CreateAsync(Product product);
        Task<Product> UpdateAsync(Product product);
        Task<bool> DeleteAsync(int id);
    }
}
