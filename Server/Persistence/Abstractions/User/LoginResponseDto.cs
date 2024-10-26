namespace Server.Persistence.Abstractions.User
{
    public class LoginResponseDto
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string AccessToken { get; set; }
    }
}
