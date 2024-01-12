import RateLimiterCache from '@lib/web-interface/http/core/ports/rate-limiter.interface';
import Redis from 'ioredis';

export default class RedisRateLimiter implements RateLimiterCache {
	private redisClient;

	constructor(redisClient: Redis) {
		this.redisClient = redisClient;
	}
	async hasReachedRateLimit(key: string): Promise<boolean> {
		const amountOfRequests = await this.redisClient.get(key);

		const rateLimit = process?.env?.RATE_LIMIT ?? 60;

		return Boolean(Number(amountOfRequests) >= Number(rateLimit));
	}

	incr(key: string) {
		this.redisClient.multi().incr(key).expire(key, 10).exec();
	}
}
