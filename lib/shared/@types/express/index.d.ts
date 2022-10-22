import RateLimiterCache from '@lib/presentation/http/core/ports/rate-limiter.interface';
import LoggerInterface from '@lib/application/ports/logger.interface';
import CacheRepository from '@lib/application/ports/dictionary-cache.interface';

declare global {
	namespace Express {
		interface Request {
			rateLimiter: RateLimiterCache;
			logger: LoggerInterface;
			cache: CacheRepository;
			requestTime: Date;
		}
	}
}

// why only this works: https://stackoverflow.com/a/58788706
