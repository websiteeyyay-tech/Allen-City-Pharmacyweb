using PharmacyApp.Application.Interfaces;

namespace PharmacyApp.Application.Services
{
    public class ReportService : IReportService
    {
        public object GetSalesSummary()
        {
            return new { TotalSales = 10500, TotalOrders = 42 };
        }

        public object GetInventoryStatus()
        {
            return new { LowStockItems = 5, OutOfStockItems = 2 };
        }
    }
}
