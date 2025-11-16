using System;

namespace PharmacyApp.Core.Entities
{
    public class EmailVerification
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string CodeHash { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public int FailedAttempts { get; set; } = 0;
        public bool IsUsed { get; set; } = false;
    }
}
