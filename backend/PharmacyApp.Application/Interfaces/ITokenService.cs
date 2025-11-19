using Microsoft.IdentityModel.Tokens;

namespace PharmacyApp.Application.Interfaces
{
    public interface ITokenService
    {
        SymmetricSecurityKey GetSymmetricSecurityKey();
    }
}
