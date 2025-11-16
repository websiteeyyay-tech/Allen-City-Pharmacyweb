using Microsoft.AspNetCore.Mvc;
using PharmacyApp.Application.Interfaces;
using PharmacyApp.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Threading.Tasks;

namespace PharmacyApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // All endpoints require authentication
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var users = await _userService.GetAllAsync();
                return Ok(new { message = "Users retrieved successfully", data = users });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to retrieve users", details = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            if (user == null)
                return BadRequest(new { message = "Invalid user data" });

            try
            {
                var createdUser = await _userService.CreateAsync(user);
                return Ok(new { message = "User created successfully", data = createdUser });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to create user", details = ex.Message });
            }
        }
    }
}
