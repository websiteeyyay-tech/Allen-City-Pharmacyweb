using PharmacyApp.Core.Entities;

namespace PharmacyApp.Core.Interfaces
{
    public interface IProductRepository : IGenericRepository<Product>
    {
        // add product-specific repository methods here if needed
    }
}
