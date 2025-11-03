using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PharmacyApp.Application.DTOs;
using PharmacyApp.Application.Interfaces;
using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;

namespace PharmacyApp.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;

        public ProductService(IProductRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ProductDto>> GetAllAsync()
        {
            var products = await _repository.GetAllAsync();
            return products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price
            });
        }

        public async Task<ProductDto> GetByIdAsync(int id)
        {
            var product = await _repository.GetByIdAsync(id);
            if (product == null) 
                return null; // or throw exception if you prefer

            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price
            };
        }

        public async Task<ProductDto> CreateAsync(ProductDto productDto)
        {
            var product = new Product
            {
                Name = productDto.Name,
                Price = productDto.Price
            };

            await _repository.AddAsync(product);

            // Update ID after creation if your repository sets it
            productDto.Id = product.Id;

            return productDto;
        }

        public async Task<ProductDto> UpdateAsync(int id, ProductDto productDto)
        {
            var product = await _repository.GetByIdAsync(id);
            if (product == null)
                return null;

            product.Name = productDto.Name;
            product.Price = productDto.Price;

            await _repository.UpdateAsync(product);
            return productDto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
            return true;
        }
    }
}
