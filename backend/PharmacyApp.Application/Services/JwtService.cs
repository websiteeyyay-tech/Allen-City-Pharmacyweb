using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PharmacyApp.Application.Interfaces;

namespace PharmacyApp.Application.Services
{
    public class JwtService : IJwtService
    {
        private readonly string _secretKey;
        private readonly string _issuer;
        private readonly string _audience;
        private readonly double _expiryMinutes;

        public JwtService(IOptions<JwtSettings> jwtOptions)
        {
            var settings = jwtOptions?.Value 
                           ?? throw new ArgumentNullException(nameof(jwtOptions));

            _secretKey = settings.SecretKey ?? throw new ArgumentNullException("JWT SecretKey missing");
            _issuer = settings.Issuer ?? throw new ArgumentNullException("JWT Issuer missing");
            _audience = settings.Audience ?? throw new ArgumentNullException("JWT Audience missing");
            _expiryMinutes = settings.DurationMinutes > 0 ? settings.DurationMinutes : 60;
        }

        public SymmetricSecurityKey GetSigningKey() => new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
        public string Issuer => _issuer;
        public string Audience => _audience;
        public TimeSpan TokenExpiry => TimeSpan.FromMinutes(_expiryMinutes);

        // ✅ This implements the interface
        public string GenerateToken(int userId, string username, string role)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, username),
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var credentials = new SigningCredentials(GetSigningKey(), SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: Issuer,
                audience: Audience,
                claims: claims,
                expires: DateTime.UtcNow.Add(TokenExpiry),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
