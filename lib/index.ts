require('module-alias/register');
import createServer from '@lib/web-interface/http/core/server';
import { buildServices } from '@lib/config/service-locator';
import config from './global-config';

(async () => {
	try {
		const services = await buildServices();
		const server = createServer(services);

		const port = config.server.port;
		server.listen(port, () => {
			services.logger.info({
				message: `Server running on port ${port}!`,
				method: 'listen',
			});
		});
	} catch (err) {
		/* eslint-disable no-console */
		console.log(err);
		process.exit(1);
	}
})();
