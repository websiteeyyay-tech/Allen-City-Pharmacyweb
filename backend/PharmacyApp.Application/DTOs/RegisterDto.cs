using System.ComponentModel.DataAnnotations;

namespace PharmacyApp.Application.DTOs
{
    public class RegisterDto
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [MinLength(8)]
        public string Password { get; set; } = string.Empty;

        [EmailAddress]
        public string? Email { get; set; }
    }
}
