namespace PharmacyApp.Application.DTOs
{
    public class VerifyEmailDto
    {
        public int UserId { get; set; }
        public string Code { get; set; } = string.Empty;
    }
}
