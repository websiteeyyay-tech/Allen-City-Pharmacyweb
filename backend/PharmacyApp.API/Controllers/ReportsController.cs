using Microsoft.AspNetCore.Mvc;
using PharmacyApp.Core.Interfaces;

namespace PharmacyApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet("sales")]
        public IActionResult GetSalesReport() => Ok(_reportService.GetSalesSummary());

        [HttpGet("inventory")]
        public IActionResult GetInventoryReport() => Ok(_reportService.GetInventoryStatus());
    }
}
