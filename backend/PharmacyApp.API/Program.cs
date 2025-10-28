using PharmacyApp.Core.Interfaces;
using PharmacyApp.Core.Services;
using PharmacyApp.Infrastructure.Data;
using PharmacyApp.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using PharmacyApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddDbContext<PharmacyDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));



builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();

// ✅ Add CORS BEFORE app.Build()
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://127.0.0.1:5173"
            )
            // Allow any GitHub Codespaces frontend dynamically
            .SetIsOriginAllowed(origin =>
                origin.Contains(".app.github.dev") || // any Codespace
                origin.StartsWith("http://localhost") ||
                origin.StartsWith("http://127.0.0.1")
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// ✅ Enable CORS before controller mapping
app.UseCors("AllowFrontend");

// Swagger setup
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();
app.Run();
