/* eslint-disable no-console */
import LoggerInterface, { LogBody } from '@lib/studies/application/ports/logger.interface';

export default class ConsoleLogger implements LoggerInterface {
	info(logBody: LogBody, message: string): void {
		console.log(message, logBody);
	}
	warning(logBody: LogBody, message: string): void {
		console.warn(message, logBody);
	}
	error(logBody: LogBody, message: string): void {
		console.error(message, logBody);
	}
	critical(logBody: LogBody, message: string): void {
		console.error(message, logBody);
	}
}
