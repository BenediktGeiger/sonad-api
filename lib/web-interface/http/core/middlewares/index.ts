import rateLimiter from '@lib/web-interface/http/core/middlewares/rate-limiter';
import errorHandler from '@lib/web-interface/http/core/middlewares/error-handler';
import bindServices from '@lib/web-interface/http/core/middlewares/bind-services';
import corsHandler from '@lib/web-interface/http/core/middlewares/cors-handler';
import jsonParser from '@lib/web-interface/http/core/middlewares/json-parser';
import cacheHandler from '@lib/web-interface/http/core/middlewares/cache-handler';
import metrics from '@lib/web-interface/http/core/middlewares/metrics';
import sanitizer from '@lib/web-interface/http/core/middlewares/sanitizer';
import requestLogger from '@lib/web-interface/http/core/middlewares/request-logger';

export {
	jsonParser,
	corsHandler,
	bindServices,
	rateLimiter,
	cacheHandler,
	errorHandler,
	metrics,
	sanitizer,
	requestLogger,
};
