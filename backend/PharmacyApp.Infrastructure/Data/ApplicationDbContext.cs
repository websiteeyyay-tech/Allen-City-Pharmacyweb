using Microsoft.EntityFrameworkCore;
using PharmacyApp.Core.Entities;

namespace PharmacyApp.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Optional: configure relationships
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Product)
                .WithMany()
                .HasForeignKey(o => o.ProductId);
        }
    }
}
