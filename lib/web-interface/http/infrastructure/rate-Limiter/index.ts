import InMemoryRateLimiter from '@lib/web-interface/http/infrastructure/rate-Limiter/inMemory/in-memory-rate-limiter';
import RedisRateLimiter from '@lib/web-interface/http/infrastructure/rate-Limiter/redis/redis-rate-limiter';
import RateLimiterInterface from '@lib/web-interface/http/core/ports/rate-limiter.interface';
import Redis from 'ioredis';

export default {
	getRateLimiter(): RateLimiterInterface {
		if (process.env.REDIS) {
			try {
				const redisClient = new Redis(String(process.env.REDIS));
				return new RedisRateLimiter(redisClient);
			} catch (err) {
				return new InMemoryRateLimiter();
			}
		}

		return new InMemoryRateLimiter();
	},
};
