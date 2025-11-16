using System.Threading.Tasks;

namespace PharmacyApp.Application.Interfaces
{
    public interface IEmailVerificationService
    {
        /// <summary>
        /// Generates a verification code for the specified user and stores it.
        /// </summary>
        /// <param name="userId">The user ID.</param>
        /// <returns>The generated verification code.</returns>
        Task<string> GenerateCodeAsync(int userId);

        /// <summary>
        /// Verifies the provided code for the user.
        /// </summary>
        /// <param name="userId">The user ID.</param>
        /// <param name="code">The verification code sent to the user.</param>
        /// <returns>True if the code is valid and not expired; otherwise false.</returns>
        Task<bool> VerifyCodeAsync(int userId, string code);
    }
}
