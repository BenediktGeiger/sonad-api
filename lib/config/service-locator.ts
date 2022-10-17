import DictionaryFactory from '@lib/infrastructure/dictionaries/index';
import RateLimiterFactory from '@lib/infrastructure/rate-Limiter/index';
import LoggerFactory from '@lib/infrastructure/logger/index';
import RedisDictionaryCache from '@lib/infrastructure/cache-repository/redis-cache-repository';
import DictionaryInterface from '@lib/domain/dictionary';
import DictionaryCacheInterface from '@lib/domain/cache-repository';
import LoggerInterface from '@lib/domain/logger/logger-interface';
import RateLimiterCacheInterface from '@lib/presentation/http/rateLimiter/rate-limiter-interface';

import Redis from 'ioredis';

export type Services = {
	dictionary: DictionaryInterface;
	dictionaryCache: DictionaryCacheInterface;
	logger: LoggerInterface;
	rateLimiter: RateLimiterCacheInterface;
};

export async function buildServices(): Promise<Services> {
	const redisClient = new Redis(String(process.env.REDIS));

	const logger = LoggerFactory.getLogger();
	const dictionary = await DictionaryFactory.getDictionary(logger);

	const services = {
		dictionary,
		dictionaryCache: new RedisDictionaryCache(redisClient),
		logger,
		rateLimiter: RateLimiterFactory.getRateLimiter(redisClient),
	};

	return services;
}
