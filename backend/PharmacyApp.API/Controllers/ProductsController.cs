using Microsoft.AspNetCore.Mvc;
using PharmacyApp.Application.Interfaces;
using PharmacyApp.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PharmacyApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Require login for product endpoints
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        [AllowAnonymous] // Public endpoint
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var products = await _productService.GetAllAsync();
                return Ok(new { message = "Products retrieved successfully", data = products });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to retrieve products", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var product = await _productService.GetByIdAsync(id);
                if (product == null)
                    return NotFound(new { message = $"Product with ID {id} not found" });

                return Ok(new { message = "Product retrieved successfully", data = product });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to retrieve product", details = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] Product product)
        {
            if (product == null)
                return BadRequest(new { message = "Invalid product data" });

            try
            {
                var created = await _productService.CreateAsync(product);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, new { message = "Product created successfully", data = created });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to create product", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] Product product)
        {
            if (product == null || product.Id != id)
                return BadRequest(new { message = "Product ID mismatch" });

            try
            {
                var updated = await _productService.UpdateAsync(product);
                return Ok(new { message = "Product updated successfully", data = updated });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = $"Product with ID {id} not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to update product", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _productService.DeleteAsync(id);
                return Ok(new { message = $"Product {id} deleted successfully" });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = $"Product with ID {id} not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to delete product", details = ex.Message });
            }
        }
    }
}
