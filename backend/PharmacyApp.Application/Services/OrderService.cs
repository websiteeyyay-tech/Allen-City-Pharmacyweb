using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using PharmacyApp.Application.Interfaces;

namespace PharmacyApp.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;

        public OrderService(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<IEnumerable<Order>> GetAllOrdersAsync()
        {
            return await _orderRepository.GetAllAsync();
        }

        public async Task<Order?> GetOrderByIdAsync(int id)
        {
            return await _orderRepository.GetByIdAsync(id);
        }

        public async Task CreateOrderAsync(Order order)
        {
            await _orderRepository.AddAsync(order);
            await _orderRepository.SaveChangesAsync();
        }

        public async Task DeleteOrderAsync(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order != null)
            {
                await _orderRepository.DeleteAsync(order);
                await _orderRepository.SaveChangesAsync();
            }
        }
    }
}
