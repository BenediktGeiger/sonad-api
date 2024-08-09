import InMemoryRateLimiter from '@lib/web-interface/http/infrastructure/rate-Limiter/inMemory/in-memory-rate-limiter';
import RedisRateLimiter from '@lib/web-interface/http/infrastructure/rate-Limiter/redis/redis-rate-limiter';
import RateLimiterInterface from '@lib/web-interface/http/core/ports/rate-limiter.interface';
import Redis from 'ioredis';
import config from '@lib/global-config';

export default {
	getRateLimiter(): RateLimiterInterface {
		const rateLimiterUrl = config.server.rateLimit.url;
		if (rateLimiterUrl) {
			try {
				const redisClient = new Redis(rateLimiterUrl);
				return new RedisRateLimiter(redisClient);
			} catch (err) {
				return new InMemoryRateLimiter();
			}
		}

		return new InMemoryRateLimiter();
	},
};
