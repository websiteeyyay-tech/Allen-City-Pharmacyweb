using System.Collections.Generic;
using System.Threading.Tasks;
using PharmacyApp.Core.Entities;

namespace PharmacyApp.Application.Interfaces
{
    public interface IOrderService
    {
        Task<IEnumerable<Order>> GetAllOrdersAsync();
        Task<Order?> GetOrderByIdAsync(int id);
        Task CreateOrderAsync(Order order);
        Task DeleteOrderAsync(int id);
    }
}
