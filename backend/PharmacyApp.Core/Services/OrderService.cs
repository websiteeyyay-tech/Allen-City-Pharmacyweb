using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;

namespace PharmacyApp.Core.Services
{
    public class OrderService : IOrderService
    {
        private readonly List<Order> _orders = new();

        public IEnumerable<Order> GetAllOrders() => _orders;

        public Order? GetOrderById(int id) => _orders.FirstOrDefault(o => o.Id == id);

        public void CreateOrder(Order order)
        {
            order.Id = _orders.Count + 1;
            _orders.Add(order);
        }

        public void DeleteOrder(int id)
        {
            var order = _orders.FirstOrDefault(o => o.Id == id);
            if (order != null)
                _orders.Remove(order);
        }
    }
}
