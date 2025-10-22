using PharmacyApp.Core.Application.DTOs;
using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;
using PharmacyApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

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
            // Include related items
            return _context.Orders.Include(o => o.Items).ToList();
        }

        public Order? GetOrderById(int id)
        {
            return _context.Orders
                .Include(o => o.Items)
                .FirstOrDefault(o => o.Id == id);
        }

        public Order CreateOrder(OrderRequestDto orderDto)
        {
            // Map DTO to Entity
            var order = new Order
            {
                CustomerName = $"{orderDto.Customer.FirstName} {orderDto.Customer.LastName}",
                Email = orderDto.Customer.Email,
                Address = orderDto.Customer.Address,
                City = orderDto.Customer.City,
                State = orderDto.Customer.State,
                Zip = orderDto.Customer.Zip,
                Phone = orderDto.Customer.Phone,
                DeliveryMethod = orderDto.DeliveryMethod,
                OrderNotes = orderDto.OrderNotes,
                Subtotal = orderDto.Totals.Subtotal,
                Shipping = orderDto.Totals.Shipping,
                Tax = orderDto.Totals.Tax,
                Total = orderDto.Totals.Total,
                CreatedAt = DateTime.UtcNow,
                Items = orderDto.Items.Select(i => new OrderItem
                {
                    ProductId = i.Id,
                    Name = i.Name,
                    Price = i.Price,
                    Quantity = i.Qty
                }).ToList()
            };

            _context.Orders.Add(order);
            _context.SaveChanges();

            return order;
        }

        public void DeleteOrder(int id)
        {
            var order = _context.Orders.Include(o => o.Items).FirstOrDefault(o => o.Id == id);
            if (order != null)
            {
                _context.OrderItems.RemoveRange(order.Items);
                _context.Orders.Remove(order);
                _context.SaveChanges();
            }
        }
    }
}
