using PharmacyApp.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PharmacyApp.Core.Interfaces
{
    public interface IOrderRepository
    {
        Task<IEnumerable<Order>> GetAllAsync();
        Task<Order?> GetByIdAsync(int id);
        Task AddAsync(Order order);
        Task DeleteAsync(Order order);
        Task SaveChangesAsync();
    }
}
