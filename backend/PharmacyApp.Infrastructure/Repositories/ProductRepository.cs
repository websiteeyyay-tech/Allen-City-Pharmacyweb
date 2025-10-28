using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;
using PharmacyApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PharmacyApp.Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly PharmacyDbContext _context;

        public ProductRepository(PharmacyDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _context.Products.ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products.FindAsync(id);
        }

        public async Task AddAsync(Product product)
        {
            await _context.Products.AddAsync(product);
        }

        public async Task UpdateAsync(Product product)
        {
            _context.Products.Update(product);
        }

        public async Task DeleteAsync(Product product)
        {
            _context.Products.Remove(product);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
