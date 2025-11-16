using Microsoft.EntityFrameworkCore;
using PharmacyApp.Core.Entities;

namespace PharmacyApp.Infrastructure.Data
{
    public class PharmacyDbContext : DbContext
    {
        public PharmacyDbContext(DbContextOptions<PharmacyDbContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // -------------------------
            // Product Table
            // -------------------------
            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("Products");

                entity.HasKey(p => p.Id);

                entity.Property(p => p.Name)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(p => p.Description)
                    .HasMaxLength(500);

                entity.Property(p => p.Price)
                    .HasColumnType("decimal(18,2)");

                entity.Property(p => p.Category)
                    .HasMaxLength(150);

                entity.Property(p => p.ImageUrl)
                    .HasMaxLength(500);

                entity.Property(p => p.Stock)
                    .HasDefaultValue(0);

                entity.Property(p => p.IsAvailable)
                    .HasDefaultValue(true);
            });

            // -------------------------
            // Order Table
            // -------------------------
            modelBuilder.Entity<Order>(entity =>
            {
                entity.ToTable("Orders");

                entity.HasKey(o => o.Id);

                entity.Property(o => o.Quantity)
                    .IsRequired();

                entity.Property(o => o.TotalPrice)
                    .HasColumnType("decimal(18,2)");

                entity.Property(o => o.CustomerName)
                    .HasMaxLength(200);

                entity.Property(o => o.CustomerEmail)
                    .HasMaxLength(200);

                entity.Property(o => o.Status)
                    .HasMaxLength(100)
                    .HasDefaultValue("Pending");

                // Relationship: Order → Product
                entity.HasOne(o => o.Product)
                    .WithMany()
                    .HasForeignKey(o => o.ProductId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Optional: Order → User
                entity.HasOne<User>()
                    .WithMany()
                    .HasForeignKey(o => o.UserId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // -------------------------
            // User Table
            // -------------------------
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");

                entity.HasKey(u => u.Id);

                entity.Property(u => u.Username)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(u => u.PasswordHash)
                    .IsRequired();

                entity.Property(u => u.Role)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasIndex(u => u.Username)
                    .IsUnique(); // Prevent duplicate accounts
            });
        }
    }
}
