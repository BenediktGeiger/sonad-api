require('module-alias/register');
import createServer from '@lib/presentation/http/core/server';
import { buildServices } from '@lib/config/service-locator';
import dotenv from 'dotenv';

(async () => {
	try {
		dotenv.config();
		const services = await buildServices();
		const server = createServer(services);

		const port = process.env.PORT ?? 8083;
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
