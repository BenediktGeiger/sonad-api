import RateLimiterCache from '@lib/presentation/http/rateLimiter/rate-limiter-interface';
import Redis from 'ioredis';

export default class RedisRateLimiter implements RateLimiterCache {
	private redisClient;

	constructor(redisClient: Redis) {
		this.redisClient = redisClient;
	}
	async hasReachedRateLimit(key: string): Promise<boolean> {
		const amountOfRequests = await this.redisClient.get(key);

		return Boolean(Number(amountOfRequests) >= 1000);
	}

	incr(key: string) {
		this.redisClient.multi().incr(key).expire(key, 10).exec();
	}
}
