using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;

namespace PharmacyApp.Core.Services;

public class ProductService : IProductService
{
    private static readonly ConcurrentDictionary<int, Product> _store = new();
    private static int _nextId = 1;

    public Task<IEnumerable<Product>> GetAllAsync()
    {
        return Task.FromResult<IEnumerable<Product>>(_store.Values.ToList());
    }

    public Task<Product?> GetByIdAsync(int id)
    {
        _store.TryGetValue(id, out var p);
        return Task.FromResult<Product?>(p);
    }

    public Task<Product> CreateAsync(Product product)
    {
        product.Id = System.Threading.Interlocked.Increment(ref _nextId);
        _store[product.Id] = product;
        return Task.FromResult(product);
    }

    public Task UpdateAsync(Product product)
    {
        _store[product.Id] = product;
        return Task.CompletedTask;
    }

    public Task DeleteAsync(int id)
    {
        _store.TryRemove(id, out _);
        return Task.CompletedTask;
    }
}
