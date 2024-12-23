namespace Server.Persistence.Abstractions.User
{
    public class LoginResponseDto
    {
        public string Id { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string AccessToken { get; set; } = null!;
        public IList<string> Roles { get; set; } = null!;
    }
}
