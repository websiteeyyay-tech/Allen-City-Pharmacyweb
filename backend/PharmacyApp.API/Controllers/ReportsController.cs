using Microsoft.AspNetCore.Mvc;
using PharmacyApp.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System;

namespace PharmacyApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // Only Admins can access reports
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet("sales")]
        public IActionResult GetSalesReport()
        {
            try
            {
                var report = _reportService.GetSalesSummary();
                return Ok(new { message = "Sales report retrieved successfully", data = report });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to generate sales report", details = ex.Message });
            }
        }

        [HttpGet("inventory")]
        public IActionResult GetInventoryReport()
        {
            try
            {
                var report = _reportService.GetInventoryStatus();
                return Ok(new { message = "Inventory report retrieved successfully", data = report });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to generate inventory report", details = ex.Message });
            }
        }
    }
}
