using BCrypt.Net;
using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;
using PharmacyApp.Application.Interfaces;
using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace PharmacyApp.Application.Services
{
    public class EmailVerificationService : IEmailVerificationService
    {
        private readonly IEmailVerificationRepository _repo;

        private const int CODE_LENGTH = 6;
        private const int EXPIRATION_MINUTES = 5;
        private const int MAX_FAILED_ATTEMPTS = 3;

        public EmailVerificationService(IEmailVerificationRepository repo)
        {
            _repo = repo;
        }

        // -------------------------------------------------------
        // Generate secure verification code (hashed in DB)
        // -------------------------------------------------------
        public async Task<string> GenerateCodeAsync(int userId)
        {
            string rawCode = GenerateSecureRandomCode(CODE_LENGTH);
            string codeHash = BCrypt.Net.BCrypt.HashPassword(rawCode);

            var existing = await _repo.GetByUserIdAsync(userId);

            if (existing != null)
            {
                existing.CodeHash = codeHash;
                existing.ExpiresAt = DateTime.UtcNow.AddMinutes(EXPIRATION_MINUTES);
                existing.FailedAttempts = 0;
                existing.IsUsed = false;

                await _repo.UpdateAsync(existing);
            }
            else
            {
                var verification = new EmailVerification
                {
                    UserId = userId,
                    CodeHash = codeHash,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(EXPIRATION_MINUTES),
                    FailedAttempts = 0,
                    IsUsed = false
                };

                await _repo.AddAsync(verification);
            }

            await _repo.SaveChangesAsync();

            return rawCode;   // Only send via email, never store plaintext
        }

        // -------------------------------------------------------
        // Check if the code is valid (hashed comparison)
        // -------------------------------------------------------
        public async Task<bool> VerifyCodeAsync(int userId, string code)
        {
            var verification = await _repo.GetByUserIdAsync(userId);

            if (verification == null)
                return false;

            // Already used
            if (verification.IsUsed)
                return false;

            // Expired
            if (verification.ExpiresAt < DateTime.UtcNow)
                return false;

            // Too many attempts
            if (verification.FailedAttempts >= MAX_FAILED_ATTEMPTS)
                return false;

            bool correct = BCrypt.Net.BCrypt.Verify(code, verification.CodeHash);

            if (!correct)
            {
                verification.FailedAttempts++;
                await _repo.UpdateAsync(verification);
                await _repo.SaveChangesAsync();
                return false;
            }

            // Successful validation
            verification.IsUsed = true;
            await _repo.UpdateAsync(verification);
            await _repo.SaveChangesAsync();

            return true;
        }

        // -------------------------------------------------------
        // Generate TRUE cryptographically secure random numeric code
        // -------------------------------------------------------
        private string GenerateSecureRandomCode(int length)
        {
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[length];
            rng.GetBytes(bytes);

            var builder = new StringBuilder();

            foreach (var b in bytes)
                builder.Append((b % 10).ToString());

            return builder.ToString();
        }
    }
}
