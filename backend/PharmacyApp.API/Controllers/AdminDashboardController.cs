using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace PharmacyApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminDashboardController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/AdminDashboard
        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            // Totals
            var totalSales = await _context.Orders.SumAsync(o => o.TotalAmount);
            var totalOrders = await _context.Orders.CountAsync();
            var totalUsers = await _context.Users.CountAsync();
            var lowStock = await _context.Products.CountAsync(p => p.StockQuantity < 10);

            // Monthly sales trend (last 6 months)
            var recentSales = await _context.Orders
                .GroupBy(o => new { o.OrderDate.Month, o.OrderDate.Year })
                .Select(g => new
                {
                    month = g.Key.Month,
                    year = g.Key.Year,
                    sales = g.Sum(x => x.TotalAmount),
                    orders = g.Count()
                })
                .OrderBy(x => x.year).ThenBy(x => x.month)
                .Take(6)
                .ToListAsync();

            return Ok(new
            {
                totalSales,
                totalOrders,
                totalUsers,
                lowStock,
                recentSales
            });
        }
    }
}
