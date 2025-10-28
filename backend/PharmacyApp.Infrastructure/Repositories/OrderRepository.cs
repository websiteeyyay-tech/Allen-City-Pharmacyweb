using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;
using PharmacyApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PharmacyApp.Infrastructure.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly PharmacyDbContext _context;

        public OrderRepository(PharmacyDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Order>> GetAllAsync()
        {
            return await _context.Orders
                .Include(o => o.Product) // optional: includes related product
                .ToListAsync();
        }

        public async Task<Order?> GetByIdAsync(int id)
        {
            return await _context.Orders
                .Include(o => o.Product)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task AddAsync(Order order)
        {
            await _context.Orders.AddAsync(order);
        }

        public async Task DeleteAsync(Order order)
        {
            _context.Orders.Remove(order);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
