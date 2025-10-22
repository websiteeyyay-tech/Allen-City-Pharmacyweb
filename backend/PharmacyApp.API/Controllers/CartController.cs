using Microsoft.AspNetCore.Mvc;

namespace PharmacyApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private static readonly List<CartItem> CartItems = new()
        {
            new CartItem { Id = 1, Name = "Pain Relief Tablets - 20 pack", Price = 8.99m, Qty = 2, Image = "https://www.deepheat.com.au/cdn/shop/files/27933NAPROXENPAINRELIEF30PK3DHIRES_1200x1200.png?v=1731997526" },
            new CartItem { Id = 2, Name = "Vitamin D3 - 60 softgels", Price = 10.5m, Qty = 1, Image = "https://medlineplus.gov/images/Vitamins_share.jpg" }
        };

        [HttpGet]
        public IActionResult GetCart()
        {
            return Ok(CartItems);
        }

        public class CartItem
        {
            public int Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public decimal Price { get; set; }
            public int Qty { get; set; }
            public string? Image { get; set; }
        }
    }
}
