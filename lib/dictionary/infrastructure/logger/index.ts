import ConsoleLogger from '@lib/dictionary/infrastructure/logger/consoleLogger/console-logger';
import WinstonLogger from '@lib/dictionary/infrastructure/logger/winstonLogger/winston-logger';

import LoggerInterface from '@lib/dictionary/application/ports/logger.interface';
import config from '@lib/global-config';

export default {
	getLogger(): LoggerInterface {
		if (config.logger.name === 'winston') {
			return new WinstonLogger();
		}

		return new ConsoleLogger();
	},
};
