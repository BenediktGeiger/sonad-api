import ConsoleLogger from '@lib/dictionary/infrastructure/logger/consoleLogger/console-logger';
import WinstonLogger from '@lib/dictionary/infrastructure/logger/winstonLogger/winston-logger';

import LoggerInterface from '@lib/dictionary/application/ports/logger.interface';

export default {
	getLogger(): LoggerInterface {
		if (process.env.LOGGER === 'winston') {
			return new WinstonLogger();
		}

		return new ConsoleLogger();
	},
};
