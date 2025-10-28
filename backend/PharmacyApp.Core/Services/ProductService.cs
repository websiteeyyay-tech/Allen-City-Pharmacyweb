using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PharmacyApp.Core.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;

        public ProductService(IProductRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Product> CreateAsync(Product product)
        {
            await _repository.AddAsync(product);
            await _repository.SaveChangesAsync();
            return product;
        }

        public async Task UpdateAsync(Product product)
        {
            var existing = await _repository.GetByIdAsync(product.Id);
            if (existing == null)
                throw new KeyNotFoundException($"Product with ID {product.Id} not found.");

            // Update only fields that should change
            existing.Name = product.Name;
            existing.SKU = product.SKU;
            existing.Description = product.Description;
            existing.Price = product.Price;
            existing.StockQuantity = product.StockQuantity;
            existing.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(existing);
            await _repository.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var product = await _repository.GetByIdAsync(id);
            if (product == null)
                throw new KeyNotFoundException($"Product with ID {id} not found.");

            await _repository.DeleteAsync(product);
            await _repository.SaveChangesAsync();
        }
    }
}
