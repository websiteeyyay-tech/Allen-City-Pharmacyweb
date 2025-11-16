using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PharmacyApp.API.Middleware;
using PharmacyApp.Application.Interfaces;
using PharmacyApp.Application.Services;
using PharmacyApp.Core.Interfaces;
using PharmacyApp.Infrastructure.Data;
using PharmacyApp.Infrastructure.Repositories;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ======================================================
// 🧩 SERVICES CONFIGURATION
// ======================================================

// Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ======================================================
// 🧩 DATABASE CONFIGURATION
// ======================================================
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                       ?? Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");

if (string.IsNullOrEmpty(connectionString))
    throw new Exception("Database connection string is missing. Set it in User-Secrets or Environment variables.");

builder.Services.AddDbContext<PharmacyDbContext>(options =>
    options.UseSqlServer(
        connectionString,
        b => b.MigrationsAssembly("PharmacyApp.Infrastructure")
    )
);

// ======================================================
// 🧩 DEPENDENCY INJECTION
// ======================================================

// Generic Repository
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

// Repositories
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IEmailVerificationRepository, EmailVerificationRepository>();

// Services
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailVerificationService, EmailVerificationService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITokenService, TokenService>();

// ======================================================
// 🧩 JWT AUTHENTICATION
// ======================================================
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKeyString = jwtSettings["SecretKey"]
                      ?? Environment.GetEnvironmentVariable("JwtSettings__SecretKey");

if (string.IsNullOrEmpty(secretKeyString))
    throw new Exception("JWT SecretKey is missing. Set it in User-Secrets or Environment variables.");

var secretKey = Encoding.UTF8.GetBytes(secretKeyString);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(secretKey)
    };
});

builder.Services.AddAuthorization();

// ======================================================
// 🧩 CORS CONFIGURATION
// ======================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .SetIsOriginAllowed(origin =>
                origin.Contains(".app.github.dev") ||  // Codespaces
                origin.StartsWith("http://localhost") ||
                origin.StartsWith("http://127.0.0.1"))
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// ======================================================
// 🧩 BUILD APP
// ======================================================
var app = builder.Build();

// ======================================================
// 🧩 MIDDLEWARE PIPELINE
// ======================================================

// Global Exception Handler
app.UseMiddleware<ExceptionMiddleware>();

// Validation Middleware (DTO validation)
app.UseMiddleware<ValidationMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Bind to all network interfaces (Codespaces / localhost frontend)
app.Urls.Add("http://0.0.0.0:5272");

app.Run();
