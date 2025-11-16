using Microsoft.AspNetCore.Mvc;
using PharmacyApp.Application.Interfaces;   // ✅ For IOrderService, IProductService
using PharmacyApp.Core.Entities;            // ✅ For Order and Product
using System;
using System.Threading.Tasks;

namespace PharmacyApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IProductService _productService;

        public OrdersController(IOrderService orderService, IProductService productService)
        {
            _orderService = orderService;
            _productService = productService;
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
            if (order == null)
                return BadRequest(new { message = "Invalid order data." });

            var product = await _productService.GetByIdAsync(order.ProductId);
            if (product == null)
                return BadRequest(new { message = "Product not found." });

            // ✅ Calculate total and assign order info
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
