using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;
using PharmacyApp.Infrastructure.Data;

namespace PharmacyApp.Infrastructure.Repositories
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        public ProductRepository(PharmacyDbContext context) : base(context)
        {
        }
    }
}
