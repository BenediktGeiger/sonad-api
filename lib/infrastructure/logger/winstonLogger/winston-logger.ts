import LoggerInterface from '@lib/domain/logger/logger-interface';
import winston from 'winston';
const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'info',
	format: combine(timestamp(), json()),
	transports: [new winston.transports.Console()],
});

export default class WinstonLogger implements LoggerInterface {
	info(payload: { message: string; method: string }): void {
		logger.info({
			message: payload.message,
			method: payload.method,
		});
	}
	warning(payload: { message: string; method: string }): void {
		logger.warning({
			message: payload.message,
			method: payload.method,
		});
	}
	error(payload: { message: string; method: string }): void {
		logger.error({
			message: payload.message,
			method: payload.method,
		});
	}
	critical(payload: { message: string; method: string }): void {
		logger.crit({
			message: payload.message,
			method: payload.method,
		});
	}
}
