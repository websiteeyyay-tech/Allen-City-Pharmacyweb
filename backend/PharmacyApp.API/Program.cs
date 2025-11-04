using Microsoft.EntityFrameworkCore;
using PharmacyApp.Application.Interfaces;
using PharmacyApp.Application.Services;
using PharmacyApp.Core.Interfaces;
using PharmacyApp.Infrastructure.Data;
using PharmacyApp.Infrastructure.Repositories;

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
builder.Services.AddDbContext<PharmacyDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("PharmacyApp.Infrastructure") // ✅ Point EF to correct migrations assembly
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

// Services
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IUserService, UserService>();

// ======================================================
// 🧩 CORS CONFIGURATION
// ======================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .SetIsOriginAllowed(origin =>
                origin.Contains(".app.github.dev") ||   // ✅ GitHub Codespaces
                origin.StartsWith("http://localhost") || // ✅ Local development
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
// 🧩 MIDDLEWARE
// ======================================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

// ✅ Bind to all interfaces (important for Codespaces or local frontend)
app.Urls.Add("http://0.0.0.0:5272");

app.Run();
