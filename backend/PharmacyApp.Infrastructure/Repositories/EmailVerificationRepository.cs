using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;
using PharmacyApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace PharmacyApp.Infrastructure.Repositories
{
    public class EmailVerificationRepository : IEmailVerificationRepository
    {
        private readonly PharmacyDbContext _context;

        public EmailVerificationRepository(PharmacyDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(EmailVerification entity)
        {
            await _context.EmailVerifications.AddAsync(entity);
        }

        public async Task<EmailVerification?> GetByUserIdAsync(int userId)
        {
            return await _context.EmailVerifications
                                 .FirstOrDefaultAsync(x => x.UserId == userId);
        }

        public async Task UpdateAsync(EmailVerification entity)
        {
            _context.EmailVerifications.Update(entity);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
