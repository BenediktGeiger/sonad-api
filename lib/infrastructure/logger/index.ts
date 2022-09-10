import ConsoleLogger from '@lib/infrastructure/logger/consoleLogger/console-logger';
import WinstonLogger from '@lib/infrastructure/logger/winstonLogger/winston-logger';

import LoggerInterface from '@lib/domain/logger/logger-interface';

export default {
	getLogger(): LoggerInterface {
		if (process.env.LOGGER === 'winston') {
			return new WinstonLogger();
		}

		return new ConsoleLogger();
	},
};
