using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace PharmacyApp.Infrastructure.Data
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<PharmacyDbContext>
    {
        public PharmacyDbContext CreateDbContext(string[] args)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString = config.GetConnectionString("DefaultConnection");

            var optionsBuilder = new DbContextOptionsBuilder<PharmacyDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new PharmacyDbContext(optionsBuilder.Options);
        }
    }
}

