import express from 'express';
import { Services } from '@lib/config/service-locator';
import router from '@lib/presentation/http/routes/router';

import {
	jsonParser,
	corsHandler,
	bindServices,
	rateLimiter,
	errorHandler,
} from '@lib/presentation/http/middlewares/index';

const createServer = async (services: Services) => {
	const server = express();

	server.use(corsHandler);
	server.use(jsonParser);
	server.use(bindServices(services));
	server.use(rateLimiter);
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
