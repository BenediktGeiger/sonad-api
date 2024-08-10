import DictionaryFactory from '@lib/dictionary/infrastructure/dictionary/index';
import DictionaryV2Factory from '@lib/dictionary/infrastructure/dictionary-v2/index';
import TranslatorFactory from '@lib/dictionary/infrastructure/translator/index';
import RateLimiterFactory from '@lib/web-interface/http/infrastructure/rate-Limiter/index';
import DictionaryCacheFactory from '@lib/dictionary/infrastructure/dictionary-cache/index';
import LoggerFactory from '@lib/dictionary/infrastructure/logger/index';
import DictionaryInterface from '@lib/dictionary/application/ports/external-dictionary.interface';
import DictionaryCacheInterface from '@lib/dictionary/application/ports/dictionary-cache.interface';
import LoggerInterface from '@lib/dictionary/application/ports/logger.interface';
import RateLimiterCacheInterface from '@lib/web-interface/http/core/ports/rate-limiter.interface';
import DictionaryService from '@lib/dictionary/application/dictionary-service';
import TranslatorService from '@lib/dictionary/application/translator-service';
import DictionaryV2Service from '@lib/dictionary/application/dictionary-v2-service';
import ExternalDictionaryV2 from '@lib/dictionary/application/ports/external-dictionary-v2.interface';
import RequestLoggerFactory from '@lib/dictionary/infrastructure/request-logger';
import RequestLogger from '@lib/dictionary/application/ports/request-logger.interface';
import BusFactory from '@lib/shared/integration/bus';
import StudiesService from '@lib/studies/application/studies-service';

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
	studiesService: StudiesService;
};

export async function buildServices(): Promise<Services> {
	const logger = LoggerFactory.getLogger();
	const dictionary = await DictionaryFactory.getDictionary(logger);
	const dictionaryV2 = await DictionaryV2Factory.getDictionary(logger);
	const requestLogger = await RequestLoggerFactory.getRequestLogger(logger);

	const dictionaryCache = DictionaryCacheFactory.getDictionaryCache();
	const translator = await TranslatorFactory.getTranslator(logger);

	const dictionaryService = new DictionaryService(dictionary, dictionaryCache, logger);
	const translatorService = new TranslatorService(translator, logger);

	const routingBus = await BusFactory.getRoutingBus(logger, dictionaryV2, dictionaryCache);
	const studiesService = new StudiesService(routingBus);

	const dictionaryV2Service = new DictionaryV2Service(routingBus);
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
		studiesService,
	};

	return services;
}
