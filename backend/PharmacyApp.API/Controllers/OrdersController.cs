using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PharmacyApp.Application.Interfaces;
using PharmacyApp.Core.Entities; // ✅ use real Product model here

namespace PharmacyApp.API.Controllers
{
    // ================================
    // 💊 Simple Entity Model for Order
    // ================================
    public class Order
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string? CustomerName { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; } = "Pending";
    }

    // ================================
    // 💊 Order Service Interface
    // ================================
    public interface IOrderService
    {
        Task<IEnumerable<Order>> GetAllOrdersAsync();
        Task<Order?> GetOrderByIdAsync(int id);
        Task CreateOrderAsync(Order order);
        Task DeleteOrderAsync(int id);
    }

    // ================================
    // 💊 Mock Product Service
    // ================================
    public class MockProductService : IProductService
    {
        private readonly List<Product> _products = new()
        {
            new Product { Id = 1, Name = "Paracetamol", Price = 10, Stock = 100 },
            new Product { Id = 2, Name = "Amoxicillin", Price = 25, Stock = 50 },
            new Product { Id = 3, Name = "Vitamin C", Price = 5, Stock = 200 }
        };

        public Task<IEnumerable<Product>> GetAllAsync()
            => Task.FromResult(_products.AsEnumerable());

        public Task<Product?> GetByIdAsync(int id)
            => Task.FromResult(_products.FirstOrDefault(p => p.Id == id));

        public Task<Product> CreateAsync(Product product)
        {
            product.Id = _products.Count > 0 ? _products.Max(p => p.Id) + 1 : 1;
            _products.Add(product);
            return Task.FromResult(product);
        }

        public Task<Product> UpdateAsync(Product product)
        {
            var existing = _products.FirstOrDefault(p => p.Id == product.Id);
            if (existing != null)
            {
                existing.Name = product.Name;
                existing.Price = product.Price;
                existing.Stock = product.Stock;
            }
            return Task.FromResult(product);
        }

        public Task DeleteAsync(int id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            if (product != null)
                _products.Remove(product);
            return Task.CompletedTask;
        }
    }

    // ================================
    // 💊 Mock Order Service
    // ================================
    public class MockOrderService : IOrderService
    {
        private readonly List<Order> _orders = new();

        public Task<IEnumerable<Order>> GetAllOrdersAsync()
            => Task.FromResult(_orders.AsEnumerable());

        public Task<Order?> GetOrderByIdAsync(int id)
            => Task.FromResult(_orders.FirstOrDefault(o => o.Id == id));

        public Task CreateOrderAsync(Order order)
        {
            order.Id = _orders.Count > 0 ? _orders.Max(o => o.Id) + 1 : 1;
            _orders.Add(order);
            return Task.CompletedTask;
        }

        public Task DeleteOrderAsync(int id)
        {
            var order = _orders.FirstOrDefault(o => o.Id == id);
            if (order != null)
                _orders.Remove(order);
            return Task.CompletedTask;
        }
    }

    // ================================
    // 💊 Orders Controller
    // ================================
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IProductService _productService;

        public OrdersController()
        {
            _orderService = new MockOrderService();
            _productService = new MockProductService();
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null)
                return NotFound(new { message = "Order not found" });
            return Ok(order);
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            var product = await _productService.GetByIdAsync(order.ProductId);
            if (product == null)
                return BadRequest(new { message = "Product not found" });

            order.TotalPrice = order.Quantity * product.Price;
            order.OrderDate = DateTime.UtcNow;
            order.Status = "Pending";

            await _orderService.CreateOrderAsync(order);

            return Ok(new
            {
                message = "Order placed successfully!",
                order
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            await _orderService.DeleteOrderAsync(id);
            return NoContent();
        }
    }
}
