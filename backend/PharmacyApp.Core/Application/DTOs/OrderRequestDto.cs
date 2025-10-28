namespace PharmacyApp.Core.Application.DTOs
{
    public class OrderRequestDto
    {
        public CustomerDto Customer { get; set; } = new();
        public string DeliveryMethod { get; set; } = string.Empty;
        public string? OrderNotes { get; set; }
        public PaymentInfoDto PaymentInfo { get; set; } = new();
        public List<CartItemDto> Items { get; set; } = new();
        public TotalsDto Totals { get; set; } = new();
    }

    public class CustomerDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Zip { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }

    public class PaymentInfoDto
    {
        public string NameOnCard { get; set; } = string.Empty;
        public string CardNumber { get; set; } = string.Empty;
        public string Exp { get; set; } = string.Empty;
        public string Cvc { get; set; } = string.Empty;
    }

    public class CartItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Qty { get; set; }
    }

    public class TotalsDto
    {
        public decimal Subtotal { get; set; }
        public decimal Shipping { get; set; }
        public decimal Tax { get; set; }
        public decimal Total { get; set; }
    }
}
