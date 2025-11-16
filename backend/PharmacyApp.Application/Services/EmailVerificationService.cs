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

        public EmailVerificationService(IEmailVerificationRepository repo)
        {
            _repo = repo;
        }

        // -----------------------------
        // Generate & store code
        // -----------------------------
        public async Task<string> GenerateCodeAsync(int userId)
        {
            var code = GenerateRandomCode(6);
            var codeHash = BCrypt.Net.BCrypt.HashPassword(code);

            var existing = await _repo.GetByUserIdAsync(userId);
            if (existing != null)
            {
                existing.CodeHash = codeHash;
                existing.ExpiresAt = DateTime.UtcNow.AddMinutes(5);
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
                    ExpiresAt = DateTime.UtcNow.AddMinutes(5),
                    FailedAttempts = 0,
                    IsUsed = false
                };
                await _repo.AddAsync(verification);
            }

            await _repo.SaveChangesAsync();

            // TODO: Send code via email here
            return code;
        }

        // -----------------------------
        // Verify code
        // -----------------------------
        public async Task<bool> VerifyCodeAsync(int userId, string code)
        {
            var verification = await _repo.GetByUserIdAsync(userId);
            if (verification == null || verification.IsUsed)
                return false;

            if (verification.ExpiresAt < DateTime.UtcNow)
                return false;

            if (verification.FailedAttempts >= 3)
                return false;

            bool matches = BCrypt.Net.BCrypt.Verify(code, verification.CodeHash);

            if (!matches)
            {
                verification.FailedAttempts++;
                await _repo.UpdateAsync(verification);
                await _repo.SaveChangesAsync();
                return false;
            }

            verification.IsUsed = true;
            await _repo.UpdateAsync(verification);
            await _repo.SaveChangesAsync();
            return true;
        }

        // -----------------------------
        // Helper: Generate random numeric code
        // -----------------------------
        private string GenerateRandomCode(int length)
        {
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[length];
            rng.GetBytes(bytes);
            var result = new StringBuilder();
            foreach (var b in bytes)
            {
                result.Append((b % 10).ToString());
            }
            return result.ToString();
        }
    }
}
