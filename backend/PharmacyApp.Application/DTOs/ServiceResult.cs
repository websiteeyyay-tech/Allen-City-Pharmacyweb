namespace PharmacyApp.Application.DTOs
{
    public class ServiceResult
    {
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }

        public static ServiceResult SuccessResult() => new ServiceResult { Success = true };
        public static ServiceResult Failed(string error) => new ServiceResult { Success = false, ErrorMessage = error };
    }
}
