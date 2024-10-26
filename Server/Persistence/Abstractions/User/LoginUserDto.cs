namespace Server.Persistence.Abstractions.User
{
    public class LoginUserDto
    {
        public string UserName { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
