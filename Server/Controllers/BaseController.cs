using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Domain;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Server.Controllers
{
    [ApiController]
    [Authorize]
    public class BaseController : ControllerBase
    {
        protected string? GetUserId()
        {
            return HttpContext.User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        }

        protected bool IsAdmin()
        {
            return User.IsInRole(Roles.SystemAdministrator);
        }
    }
}
