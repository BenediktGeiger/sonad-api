import Logger from '@lib/dictionary/application/ports/logger.interface';
import ConsoleRequestLogger from './console/console-request-logger';
import RequestLogger from '@lib/dictionary/application/ports/request-logger.interface';
import PostgresRequestLogger from './postgres/postgres-request-logger';

export default {
	async getRequestLogger(logger: Logger): Promise<RequestLogger> {
		if (process.env.POSTGRES?.startsWith('postgres://')) {
			return new PostgresRequestLogger(logger, process.env.POSTGRES);
		}

		return new ConsoleRequestLogger();
	},
};
