import ConsoleLogger from './console-logger';

import LoggerInterface from '@lib/studies/application/ports/logger.interface';

export default {
	getLogger(): LoggerInterface {
		return new ConsoleLogger();
	},
};
