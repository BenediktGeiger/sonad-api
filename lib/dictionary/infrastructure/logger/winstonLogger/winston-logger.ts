import LoggerInterface from '@lib/dictionary/application/ports/logger.interface';
import winston from 'winston';
const { combine, timestamp, json } = winston.format;
import { LogPayload } from '@lib/dictionary/application/ports/logger.interface';
import config from '@lib/global-config';

const logger = winston.createLogger({
	level: config.logger.level,
	format: combine(timestamp(), json()),
	transports: [new winston.transports.Console()],
});

export default class WinstonLogger implements LoggerInterface {
	info(payload: LogPayload): void {
		const { message, context, ...rest } = payload;
		logger.info({
			message,
			context,
			...rest,
		});
	}
	warning(payload: LogPayload): void {
		const { message, context, ...rest } = payload;
		logger.warn({
			message,
			context,
			...rest,
		});
	}
	error(payload: LogPayload): void {
		const { message, context, ...rest } = payload;

		logger.error({
			message,
			context,
			...rest,
		});
	}
	critical(payload: LogPayload): void {
		const { message, context, ...rest } = payload;

		logger.crit({
			message,
			context,
			...rest,
		});
	}
	debug(payload: LogPayload): void {
		const { message, context, ...rest } = payload;

		logger.debug({
			message,
			context,
			...rest,
		});
	}
}
