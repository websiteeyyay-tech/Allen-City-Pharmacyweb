namespace PharmacyApp.Application.DTOs
{
    public class RegisterResult
    {
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }
        public int UserId { get; set; }

        public static RegisterResult Ok(int userId) => new RegisterResult { Success = true, UserId = userId };
        public static RegisterResult Failed(string error) => new RegisterResult { Success = false, ErrorMessage = error };
    }
}
