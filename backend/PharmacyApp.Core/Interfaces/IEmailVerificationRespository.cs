using PharmacyApp.Core.Entities;
using System.Threading.Tasks;

namespace PharmacyApp.Core.Interfaces
{
    public interface IEmailVerificationRepository
    {
        Task AddAsync(EmailVerification entity);
        Task<EmailVerification?> GetByUserIdAsync(int userId);
        Task UpdateAsync(EmailVerification entity);
        Task SaveChangesAsync();
    }
}
