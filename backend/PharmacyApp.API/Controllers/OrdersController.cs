using Microsoft.AspNetCore.Mvc;
using PharmacyApp.Application.Interfaces;
using PharmacyApp.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Threading.Tasks;

namespace PharmacyApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // All order endpoints require authentication
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
            try
            {
                var orders = await _orderService.GetAllOrdersAsync();
                return Ok(new { message = "Orders retrieved successfully", data = orders });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to retrieve orders", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            try
            {
                var order = await _orderService.GetOrderByIdAsync(id);
                if (order == null)
                    return NotFound(new { message = "Order not found" });

                return Ok(new { message = "Order retrieved successfully", data = order });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to retrieve order", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            if (order == null)
                return BadRequest(new { message = "Invalid order data" });

            try
            {
                var product = await _productService.GetByIdAsync(order.ProductId);
                if (product == null)
                    return BadRequest(new { message = "Product not found" });

                order.TotalPrice = order.Quantity * product.Price;
                order.OrderDate = DateTime.UtcNow;
                order.Status = "Pending";

                await _orderService.CreateOrderAsync(order);
                return Ok(new { message = "Order placed successfully", data = order });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to create order", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Only Admins can delete orders
        public async Task<IActionResult> DeleteOrder(int id)
        {
            try
            {
                var existingOrder = await _orderService.GetOrderByIdAsync(id);
                if (existingOrder == null)
                    return NotFound(new { message = "Order not found" });

                await _orderService.DeleteOrderAsync(id);
                return Ok(new { message = $"Order {id} deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to delete order", details = ex.Message });
            }
        }
    }
}
