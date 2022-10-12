import RateLimiterCache from '@lib/presentation/http/rateLimiter/rate-limiter-interface';

interface inMemoryCounter {
	[key: string]: number;
}

export default class InMemoryRateLimiter implements RateLimiterCache {
	private inMemoryCounter: inMemoryCounter;

	constructor(inMemoryCounter: inMemoryCounter = {}) {
		this.inMemoryCounter = inMemoryCounter;
	}
	async hasReachedRateLimit(key: string): Promise<boolean> {
		return Boolean(this.inMemoryCounter[key] >= 100);
	}

	incr(key: string) {
		if (!this.inMemoryCounter[key]) {
			this.inMemoryCounter[key] = 1;
			return;
		}
		this.inMemoryCounter[key]++;
	}
}
