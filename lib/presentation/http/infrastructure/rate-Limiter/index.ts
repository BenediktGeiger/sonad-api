import InMemoryRateLimiter from '@lib/presentation/http/infrastructure/rate-Limiter/inMemory/in-memory-rate-limiter';
import RedisRateLimiter from '@lib/presentation/http/infrastructure/rate-Limiter/redis/redis-rate-limiter';
import RateLimiterInterface from '@lib/presentation/http/core/ports/rate-limiter.interface';
import Redis from 'ioredis';

export default {
	getRateLimiter(redisClient: Redis): RateLimiterInterface {
		if (redisClient) {
			return new RedisRateLimiter(redisClient);
		}
		return new InMemoryRateLimiter();
	},
};
