using Microsoft.AspNetCore.Mvc;

namespace PharmacyApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController : ControllerBase
    {
        private static dynamic _settings = new {
            Name = "Admin Name",
            Email = "admin@email.com",
            DarkMode = false,
            Notifications = true,
            ProfileImage = "",
        };

        [HttpGet("{userId}")]
        public IActionResult GetSettings(int userId) => Ok(_settings);

        [HttpPost]
        public IActionResult SaveSettings([FromBody] dynamic newSettings)
        {
            _settings = newSettings;
            return Ok(new { message = "Settings saved successfully!" });
        }
    }
}
