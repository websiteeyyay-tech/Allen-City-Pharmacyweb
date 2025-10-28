using PharmacyApp.Core.Interfaces;
using PharmacyApp.Core.Services;
using PharmacyApp.Infrastructure.Data;
using PharmacyApp.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ------------------ SERVICES ------------------

// ✅ Add Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ Database Context (SQL Server)
builder.Services.AddDbContext<PharmacyDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ Dependency Injection for Repositories & Services
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// ------------------ CORS CONFIG ------------------
// ✅ Allow localhost (React) and GitHub Codespaces
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",     // Vite
                "http://127.0.0.1:5173",    // Vite alternate
                "http://localhost:3000",    // CRA (optional)
                "http://127.0.0.1:3000"
            )
            .SetIsOriginAllowed(origin =>
                origin.Contains(".app.github.dev") ||  // For Codespaces
                origin.StartsWith("http://localhost") ||
                origin.StartsWith("http://127.0.0.1"))
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// ------------------ MIDDLEWARE ------------------

// ✅ Enable Swagger in Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ✅ Use CORS *before* routing & authorization
app.UseCors("AllowFrontend");

app.UseHttpsRedirection(); // Optional, but recommended if you use SSL

app.UseAuthorization();

app.MapControllers();

app.Run();
