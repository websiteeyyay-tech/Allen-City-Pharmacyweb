using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Linq;
using System.Threading.Tasks;

namespace PharmacyApp.API.Middleware
{
    public class ValidationMiddleware
    {
        private readonly RequestDelegate _next;

        public ValidationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // If the request has already been short-circuited, skip
            if (!context.Request.HasFormContentType && context.Request.ContentLength > 0)
            {
                var endpoint = context.GetEndpoint();
                if (endpoint != null)
                {
                    var actionDescriptor = endpoint.Metadata.GetMetadata<Microsoft.AspNetCore.Mvc.Controllers.ControllerActionDescriptor>();
                    if (actionDescriptor != null)
                    {
                        var modelState = context.Features.Get<ModelStateFeature>()?.ModelState;
                        if (modelState != null && !modelState.IsValid)
                        {
                            var errors = modelState.Values
                                .SelectMany(v => v.Errors)
                                .Select(e => e.ErrorMessage)
                                .ToArray();

                            context.Response.StatusCode = StatusCodes.Status400BadRequest;
                            await context.Response.WriteAsJsonAsync(new { Message = "Validation failed", Errors = errors });
                            return;
                        }
                    }
                }
            }

            await _next(context);
        }
    }

    // Helper feature to enable middleware access to ModelState
    public class ModelStateFeature
    {
        public ModelStateDictionary ModelState { get; set; } = new();
    }
}
