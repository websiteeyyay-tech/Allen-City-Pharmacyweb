namespace PharmacyApp.Core.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }

        // ✅ Added this for ProductService compatibility
        public int Stock { get; set; }

        // Optional fields you may want for a pharmacy app:
        public string Category { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsAvailable { get; set; } = true;
    }
}
