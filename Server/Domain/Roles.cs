namespace Server.Domain
{
    public class Roles
    {
        public const string Member = nameof(Member);
        public const string FacilityAdministrator = nameof(FacilityAdministrator);
        public const string SystemAdministrator = nameof(SystemAdministrator);

        public static readonly IReadOnlyCollection<string> AllRoles = [
            Member,
            FacilityAdministrator,
            SystemAdministrator,
        ];
    }
}
