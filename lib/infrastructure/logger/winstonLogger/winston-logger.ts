import LoggerInterface from '@lib/application/ports/logger.interface';
import winston from 'winston';
const { combine, timestamp, json } = winston.format;
import { LogPayload } from '@lib/application/ports/logger.interface';

const logger = winston.createLogger({
	level: 'info',
	format: combine(timestamp(), json()),
	transports: [new winston.transports.Console()],
});

export default class WinstonLogger implements LoggerInterface {
	info(payload: LogPayload): void {
		const { message, method, ...rest } = payload;
		logger.info({
			message,
			method,
			...rest,
		});
	}
	warning(payload: LogPayload): void {
		const { message, method, ...rest } = payload;
		logger.warning({
			message,
			method,
			...rest,
		});
	}
	error(payload: LogPayload): void {
		const { message, method, ...rest } = payload;

		logger.error({
			message,
			method,
			...rest,
		});
	}
	critical(payload: LogPayload): void {
		const { message, method, ...rest } = payload;

		logger.crit({
			message,
			method,
			...rest,
		});
	}
}
