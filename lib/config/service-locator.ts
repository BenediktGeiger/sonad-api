import DictionaryFactory from '@lib/infrastructure/dictionary/index';
import DictionaryV2Factory from '@lib/infrastructure/dictionary-v2/index';
import TranslatorFactory from '@lib/infrastructure/translator/index';
import RateLimiterFactory from '@lib/presentation/http/infrastructure/rate-Limiter/index';
import DictionaryCacheFactory from '@lib/infrastructure/dictionary-cache/index';
import LoggerFactory from '@lib/infrastructure/logger/index';
import DictionaryInterface from '@lib/application/ports/external-dictionary.interface';
import DictionaryCacheInterface from '@lib/application/ports/dictionary-cache.interface';
import LoggerInterface from '@lib/application/ports/logger.interface';
import RateLimiterCacheInterface from '@lib/presentation/http/core/ports/rate-limiter.interface';
import DictionaryService from '@lib/application/dictionary-service';
import TranslatorService from '@lib/application/translator-service';
import DictionaryV2Service from '@lib/application/dictionary-v2-service';
import ExternalDictionaryV2 from '@lib/application/ports/external-dictionary-v2.interface';
import RequestLoggerFactory from '@lib/infrastructure/request-logger';
import RequestLogger from '@lib/application/ports/request-logger.interface';

export type Services = {
	dictionaryService: DictionaryService;
	dictionaryV2Service: DictionaryV2Service;
	translatorService: TranslatorService;
	dictionary: DictionaryInterface;
	dictionaryV2: ExternalDictionaryV2;
	dictionaryCache: DictionaryCacheInterface;
	logger: LoggerInterface;
	rateLimiter: RateLimiterCacheInterface;
	requestLogger: RequestLogger;
};

export async function buildServices(): Promise<Services> {
	const logger = LoggerFactory.getLogger();
	const dictionary = await DictionaryFactory.getDictionary(logger);
	const dictionaryV2 = await DictionaryV2Factory.getDictionary(logger);
	const requestLogger = await RequestLoggerFactory.getRequestLogger(logger);

	const dictionaryCache = DictionaryCacheFactory.getDictionaryCache();
	const translator = await TranslatorFactory.getTranslator(logger);

	const dictionaryService = new DictionaryService(dictionary, dictionaryCache, logger);
	const dictionaryV2Service = new DictionaryV2Service(dictionaryV2, dictionaryCache, logger);
	const translatorService = new TranslatorService(translator, logger);

	const services = {
		dictionaryService,
		dictionaryV2Service,
		dictionaryV2,
		translatorService,
		dictionary,
		dictionaryCache,
		logger,
		rateLimiter: RateLimiterFactory.getRateLimiter(),
		requestLogger,
	};

	return services;
}
