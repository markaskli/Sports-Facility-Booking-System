using Microsoft.AspNetCore.Identity;
using Server.Domain;
using Server.Domain.Auth;

namespace Server.Persistence
{
    public class DbInitialization
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public DbInitialization(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task SeedAuth()
        {
            await AddDefaultRolesAsync();
            await AddAdminUserAsync();
        }

        private async Task AddAdminUserAsync()
        {
            var adminUser = new User()
            {
                UserName = "admin",
                Email = "admin@reservations.com"
            };

            var adminUserExists = await _userManager.FindByNameAsync(adminUser.UserName);
            if (adminUserExists == null)
            {
                var createdAdminUser = await _userManager.CreateAsync(adminUser, "Pa$$w0rd");
                if (createdAdminUser.Succeeded)
                {
                    await _userManager.AddToRolesAsync(adminUser, Roles.AllRoles);
                }
            }
        }

        private async Task AddDefaultRolesAsync()
        {
            foreach(var role in Roles.AllRoles)
            {
                var roleExists = await _roleManager.RoleExistsAsync(role);
                if (!roleExists)
                {
                    await _roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }
    }
}
