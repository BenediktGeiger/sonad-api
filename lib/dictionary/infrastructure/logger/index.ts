import ConsoleLogger from '@lib/dictionary/infrastructure/logger/consoleLogger/console-logger';
import WinstonLogger from '@lib/dictionary/infrastructure/logger/winstonLogger/winston-logger';
import AxiomWinstonLogger from '@lib/dictionary/infrastructure/logger/winstonAxiomLogger/winston-axiom-logger';

import LoggerInterface from '@lib/dictionary/application/ports/logger.interface';
import config from '@lib/global-config';

export default {
	getLogger(): LoggerInterface {
		if (config.logger.name === 'winston') {
			return new WinstonLogger();
		}

		if (
			config.logger.name === 'axiom' &&
			Boolean(config.logger.axiom.token) &&
			Boolean(config.logger.axiom.dataset)
		) {
			return new AxiomWinstonLogger();
		}

		return new ConsoleLogger();
	},
};
