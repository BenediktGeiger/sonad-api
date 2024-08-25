import LoggerInterface from '@lib/dictionary/application/ports/logger.interface';
import winston from 'winston';
import { WinstonTransport as AxiomTransport } from '@axiomhq/winston';
import { LogPayload } from '@lib/dictionary/application/ports/logger.interface';
import config from '@lib/global-config';

const logger = winston.createLogger({
	level: config.logger.level,
	format: winston.format.json(),
	transports: [
		new AxiomTransport({
			dataset: config.logger.axiom.dataset,
			token: config.logger.axiom.token,
		}),
	],
});

export default class AxiomWinstonLogger implements LoggerInterface {
	info(payload: LogPayload): void {
		const { message, context, ...rest } = payload;

		logger.info(message, {
			context,
			...rest,
		});
	}
	warning(payload: LogPayload): void {
		const { message, context, ...rest } = payload;

		logger.warn(message, {
			context,
			...rest,
		});
	}
	error(payload: LogPayload): void {
		const { message, context, ...rest } = payload;

		logger.error(message, {
			context,
			...rest,
		});
	}
	critical(payload: LogPayload): void {
		const { message, context, ...rest } = payload;
		logger.crit(message, {
			context,
			...rest,
		});
	}
	debug(payload: LogPayload): void {
		const { message, context, ...rest } = payload;

		logger.debug(message, {
			context,
			...rest,
		});
	}
}
