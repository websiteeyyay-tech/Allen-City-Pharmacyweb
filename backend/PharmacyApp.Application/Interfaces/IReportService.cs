namespace PharmacyApp.Application.Interfaces
{
    public interface IReportService
    {
        object GetSalesSummary();
        object GetInventoryStatus();
    }
}
