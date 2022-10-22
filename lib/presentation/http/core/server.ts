import express from 'express';
import { Services } from '@lib/config/service-locator';
import router from '@lib/presentation/http/core/routes/router';

import {
	jsonParser,
	corsHandler,
	bindServices,
	rateLimiter,
	cacheHandler,
	errorHandler,
	metrics,
} from '@lib/presentation/http/core/middlewares/index';

const createServer = async (services: Services) => {
	const server = express();

	server.disable('etag');
	server.use(metrics());
	server.use(corsHandler);
	server.use(jsonParser);
	server.use(bindServices(services));
	server.use(rateLimiter);
	server.use(cacheHandler);
	router(server, services);
	server.use(errorHandler);

	const port = process.env.PORT ?? 8083;
	server.listen(port, () => {
		services.logger.info({
			message: `Server running on port ${port}!`,
			method: 'listen',
		});
	});
};

export default createServer;
