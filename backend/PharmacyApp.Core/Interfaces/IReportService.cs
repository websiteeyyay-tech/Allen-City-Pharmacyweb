namespace PharmacyApp.Core.Interfaces
{
    public interface IReportService
    {
        object GetSalesSummary();
        object GetInventoryStatus();
    }
}
