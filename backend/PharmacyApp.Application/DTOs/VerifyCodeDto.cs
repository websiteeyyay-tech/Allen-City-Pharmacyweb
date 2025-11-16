using System.ComponentModel.DataAnnotations;

namespace PharmacyApp.Application.DTOs
{
    public class VerifyCodeDto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [RegularExpression(@"^\d{4,8}$")]
        public string Code { get; set; } = string.Empty;
    }
}
