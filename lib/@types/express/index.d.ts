import RateLimiterCache from '@lib/presentation/http/rateLimiter/rate-limiter-interface';
import LoggerInterface from '@lib/domain/logger/logger-interface';

declare global {
	namespace Express {
		interface Request {
			rateLimiter: RateLimiterCache;
			logger: LoggerInterface;
			requestTime: Date;
		}
	}
}

// why only this works: https://stackoverflow.com/a/58788706
