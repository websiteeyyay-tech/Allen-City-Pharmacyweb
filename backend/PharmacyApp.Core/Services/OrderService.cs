using PharmacyApp.Core.Application.DTOs;
using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;
using PharmacyApp.Infrastructure.Data;

namespace PharmacyApp.Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly PharmacyDbContext _context;

        public OrderService(PharmacyDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Order> GetAllOrders()
        {
            return _context.Orders.ToList();
        }

        public Order? GetOrderById(int id)
        {
            return _context.Orders.Find(id);
        }

        public Order CreateOrder(OrderRequestDto orderDto)
        {
            var order = new Order
            {
                // Map basic info
                DeliveryMethod = orderDto.DeliveryMethod,
                OrderNotes = orderDto.OrderNotes,

                // Example of flattening nested data (assuming your Order entity has these)
                CustomerName = $"{orderDto.Customer.FirstName} {orderDto.Customer.LastName}",
                CustomerEmail = orderDto.Customer.Email,
                CustomerAddress = $"{orderDto.Customer.Address}, {orderDto.Customer.City}, {orderDto.Customer.State}, {orderDto.Customer.Zip}",
                CustomerPhone = orderDto.Customer.Phone,

                // Totals
                Subtotal = orderDto.Totals.Subtotal,
                Shipping = orderDto.Totals.Shipping,
                Tax = orderDto.Totals.Tax,
                Total = orderDto.Totals.Total,

                // Store order date
                OrderDate = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            _context.SaveChanges();

            return order;
        }

        public void DeleteOrder(int id)
        {
            var order = _context.Orders.Find(id);
            if (order != null)
            {
                _context.Orders.Remove(order);
                _context.SaveChanges();
            }
        }
    }
}
