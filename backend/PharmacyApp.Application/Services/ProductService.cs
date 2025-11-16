using PharmacyApp.Application.Interfaces;
using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PharmacyApp.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _productRepository.GetAllAsync();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _productRepository.GetByIdAsync(id);
        }

        public async Task<Product> CreateAsync(Product product)
        {
            if (product == null)
                throw new System.ArgumentNullException(nameof(product));

            return await _productRepository.AddAsync(product);
        }

        public async Task<Product> UpdateAsync(Product product)
        {
            if (product == null)
                throw new System.ArgumentNullException(nameof(product));

            return await _productRepository.UpdateAsync(product);
        }

        public async Task<Product?> GetProductByIdAsync(int id)
        {
            return await _productRepository.GetByIdAsync(id);
        }

        public async Task DeleteAsync(int id)
        {
            var deleted = await _productRepository.DeleteAsync(id);
            if (!deleted)
                throw new KeyNotFoundException($"Product with ID {id} not found.");
        }
    }
}
