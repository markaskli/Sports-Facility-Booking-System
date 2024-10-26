using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Server.Domain;
using Server.Domain.Auth;
using Server.Persistence.Abstractions.User;
using Server.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Transactions;

namespace Server.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private const string SessionClaimTypeName = "SessionId";
        private readonly IJwtTokenService _jwtTokenService;
        private readonly ISessionService _sessionService;
        private readonly UserManager<User> _userManager;

        public AuthenticationController(IJwtTokenService jwtTokenService, ISessionService sessionService, UserManager<User> userManager)
        {
            _jwtTokenService = jwtTokenService;
            _sessionService = sessionService;
            _userManager = userManager;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterUserDto request)
        {
            var user = await _userManager.FindByNameAsync(request.UserName);
            if (user != null)
            {
                return BadRequest(new ProblemDetails() { Detail = "User with specified user name already exists." });
            }

            var newUser = new User()
            {
                UserName = request.UserName,
                Email = request.Email
            };

            using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var createdUser = await _userManager.CreateAsync(newUser, request.Password);
                if (!createdUser.Succeeded)
                {
                    return BadRequest();
                }

                await _userManager.AddToRoleAsync(newUser, Roles.Member);

                transaction.Complete();
            }

            return Ok();
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login(LoginUserDto request)
        {
            var user = await _userManager.FindByNameAsync(request.UserName);
            if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            {
                return Unauthorized();
            }

            var roles = await _userManager.GetRolesAsync(user);
            var sessionId = Guid.NewGuid();
            var expiresAt = DateTime.UtcNow.AddDays(3);
            var accessToken = _jwtTokenService.CreateAccessToken(user.UserName, user.Id, roles);
            var refreshToken = _jwtTokenService.CreateRefreshToken(user.Id, expiresAt, sessionId);

            await _sessionService.CreateSessionAsync(sessionId, user.Id, refreshToken, expiresAt);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Lax,
                Expires = expiresAt
                //Secure = false => should be true (HTTPS)
            };

            HttpContext.Response.Cookies.Append("RefreshToken", refreshToken, cookieOptions);

            return Ok(new LoginResponseDto()
            {
                UserName = user.UserName,
                Email = user.Email!,
                AccessToken = accessToken,
            });
        }

        [HttpPost("accessToken")]
        public async Task<ActionResult<string>> AccessToken()
        {
            if (!HttpContext.Request.Cookies.TryGetValue("RefreshToken", out var refreshToken))
            {
                return StatusCode(422);
            }

            if (!_jwtTokenService.TryParseRefreshToken(refreshToken, out var claims))
            {
                return StatusCode(422);
            }

            var sessionId = claims.FindFirstValue(SessionClaimTypeName);
            if (string.IsNullOrWhiteSpace(sessionId))
            {
                return BadRequest();
            }

            var sessionIdAsGuid = Guid.Parse(sessionId);
            if (!await _sessionService.IsSessionValidAsync(sessionIdAsGuid, refreshToken))
            {
                return BadRequest();
            }

            var userId = claims.FindFirstValue(JwtRegisteredClaimNames.Sub);
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return BadRequest();
            }

            var roles = await _userManager.GetRolesAsync(user);
            var expiresAt = DateTime.UtcNow.AddDays(3);
            var accessToken = _jwtTokenService.CreateAccessToken(user.UserName, userId, roles);
            var newRefreshToken = _jwtTokenService.CreateRefreshToken(userId, expiresAt, sessionIdAsGuid);


            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Lax,
                Expires = expiresAt
                //Secure = false => should be true (HTTPS)
            };

            HttpContext.Response.Cookies.Append("RefreshToken", newRefreshToken, cookieOptions);

            await _sessionService.ExtendSessionAsync(sessionIdAsGuid, newRefreshToken, expiresAt);

            return Ok(accessToken);
        }

        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            if (!HttpContext.Request.Cookies.TryGetValue("RefreshToken", out var refreshToken))
            {
                return StatusCode(422);
            }

            if (!_jwtTokenService.TryParseRefreshToken(refreshToken, out var claims))
            {
                return StatusCode(422);
            }

            var sessionId = claims.FindFirstValue(SessionClaimTypeName);
            if (string.IsNullOrWhiteSpace(sessionId))
            {
                return BadRequest();
            }

            await _sessionService.InvalidateSessionAsync(Guid.Parse(sessionId));
            HttpContext.Response.Cookies.Delete("RefreshToken");

            return Ok();
        }
    }
}
