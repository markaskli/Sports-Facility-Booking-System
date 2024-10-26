using Server.Domain.Auth;
using Server.Extensions;
using Server.Persistence;

namespace Server.Services
{
    public interface ISessionService
    {
        Task CreateSessionAsync(Guid sessionId, string userId, string refreshToken, DateTime expiresAt);
        Task ExtendSessionAsync(Guid sessionId, string refreshToken, DateTime expiresAt);
        Task InvalidateSessionAsync (Guid sessionId);
        Task<bool> IsSessionValidAsync(Guid sessionId, string refreshToken);
    }

    public class SessionService : ISessionService
    {
        private readonly ReservationDbContext _dbContext;
        public SessionService(ReservationDbContext context)
        {
            _dbContext = context;
        }

        public async Task CreateSessionAsync(Guid sessionId, string userId, string refreshToken, DateTime expiresAt)
        {
            var session = new Session()
            {
                Id = sessionId,
                UserId = userId,
                InitiatedAt = DateTimeOffset.UtcNow,
                LastRefreshToken = refreshToken.ToSHA256(),
                ExpiresAt = expiresAt
            };

            _dbContext.Sessions.Add(session);
            await _dbContext.SaveChangesAsync();
        }

        public async Task ExtendSessionAsync(Guid sessionId, string refreshToken, DateTime expiresAt)
        {
            var session = await _dbContext.Sessions.FindAsync(sessionId);
            if (session == null)
            {
                return;
            }

            session.ExpiresAt = expiresAt;
            session.LastRefreshToken = refreshToken.ToSHA256();

            await _dbContext.SaveChangesAsync();
        }

        public async Task InvalidateSessionAsync(Guid sessionId)
        {
            var session = await _dbContext.Sessions.FindAsync(sessionId);
            if (session == null)
            {
                return;
            }

            session.IsRevoked = true;

            await _dbContext.SaveChangesAsync();
        }

        public async Task<bool> IsSessionValidAsync(Guid sessionId, string refreshToken)
        {
            var session = await _dbContext.Sessions.FindAsync(sessionId);
            return session is not null 
                && !session.IsRevoked 
                && session.ExpiresAt >= DateTimeOffset.UtcNow 
                && session.LastRefreshToken == refreshToken.ToSHA256();
        }
    }
}
