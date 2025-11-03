namespace PharmacyApp.Core.Entities
{
    public class Order : BaseEntity
    {
        public int ProductId { get; set; }
        public Product? Product { get; set; }

        public int Quantity { get; set; }

        // ✅ Combine your price & amount fields into one meaning
        public decimal TotalPrice { get; set; }
        public decimal TotalAmount => TotalPrice * Quantity; // optional computed property

        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Pending";

        // Optional: link to user if needed
        public int? UserId { get; set; }
    }
}
