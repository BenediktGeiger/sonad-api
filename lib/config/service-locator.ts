import DictionaryFactory from '@lib/infrastructure/dictionary/index';
import RateLimiterFactory from '@lib/presentation/http/infrastructure/rate-Limiter/index';
import DictionaryCacheFactory from '@lib/infrastructure/dictionary-cache/index';
import LoggerFactory from '@lib/infrastructure/logger/index';
import DictionaryInterface from '@lib/application/ports/dictionary';
import DictionaryCacheInterface from '@lib/application/ports/dictionary-cache.interface';
import LoggerInterface from '@lib/application/ports/logger.interface';
import RateLimiterCacheInterface from '@lib/presentation/http/core/ports/rate-limiter.interface';
import DictionaryService from '@lib/application/dictionary-service';

export type Services = {
	dictionaryService: DictionaryService;
	dictionary: DictionaryInterface;
	dictionaryCache: DictionaryCacheInterface;
	logger: LoggerInterface;
	rateLimiter: RateLimiterCacheInterface;
};

export async function buildServices(): Promise<Services> {
	const logger = LoggerFactory.getLogger();
	const dictionary = await DictionaryFactory.getDictionary(logger);

	const dictionaryCache = DictionaryCacheFactory.getDictionaryCache();

	const dictionaryService = new DictionaryService(dictionary, dictionaryCache, logger);

	const services = {
		dictionaryService,
		dictionary,
		dictionaryCache,
		logger,
		rateLimiter: RateLimiterFactory.getRateLimiter(),
	};

	return services;
}
