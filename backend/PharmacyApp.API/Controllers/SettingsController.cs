using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;

namespace PharmacyApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // User must be logged in to access settings
    public class SettingsController : ControllerBase
    {
        private static dynamic _settings = new {
            Name = "Admin Name",
            Email = "admin@email.com",
            DarkMode = false,
            Notifications = true,
            ProfileImage = ""
        };

        [HttpGet("{userId}")]
        public IActionResult GetSettings(int userId)
        {
            try
            {
                return Ok(new { message = "Settings retrieved successfully", data = _settings });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to retrieve settings", details = ex.Message });
            }
        }

        [HttpPost]
        public IActionResult SaveSettings([FromBody] dynamic newSettings)
        {
            if (newSettings == null)
                return BadRequest(new { message = "Invalid settings data" });

            try
            {
                _settings = newSettings;
                return Ok(new { message = "Settings saved successfully", data = _settings });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to save settings", details = ex.Message });
            }
        }
    }
}
