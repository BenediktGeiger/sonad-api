import RateLimiterCache from '@lib/presentation/http/rateLimiter/rate-limiter-interface';
import LoggerInterface from '@lib/domain/logger/logger-interface';
import CacheRepository from '@lib/domain/cache-repository';

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
