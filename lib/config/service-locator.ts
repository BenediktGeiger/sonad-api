import DictionaryFactory from '@lib/infrastructure/dictionary/index';
import RateLimiterFactory from '@lib/presentation/http/infrastructure/rate-Limiter/index';
import LoggerFactory from '@lib/infrastructure/logger/index';
import RedisDictionaryCache from '@lib/infrastructure/dictionary-cache/redis-cache-repository';
import DictionaryInterface from '@lib/application/ports/dictionary';
import DictionaryCacheInterface from '@lib/application/ports/dictionary-cache.interface';
import LoggerInterface from '@lib/application/ports/logger.interface';
import RateLimiterCacheInterface from '@lib/presentation/http/core/ports/rate-limiter.interface';
import DictionaryService from '@lib/application/dictionary-service';

import Redis from 'ioredis';

export type Services = {
	dictionaryService: DictionaryService;
	dictionary: DictionaryInterface;
	dictionaryCache: DictionaryCacheInterface;
	logger: LoggerInterface;
	rateLimiter: RateLimiterCacheInterface;
};

export async function buildServices(): Promise<Services> {
	const redisClient = new Redis(String(process.env.REDIS));

	const logger = LoggerFactory.getLogger();
	const dictionary = await DictionaryFactory.getDictionary(logger);

	const dictionaryCache = new RedisDictionaryCache(redisClient);

	const dictionaryService = new DictionaryService(dictionary, dictionaryCache, logger);

	const services = {
		dictionaryService,
		dictionary,
		dictionaryCache: new RedisDictionaryCache(redisClient),
		logger,
		rateLimiter: RateLimiterFactory.getRateLimiter(redisClient),
	};

	return services;
}
