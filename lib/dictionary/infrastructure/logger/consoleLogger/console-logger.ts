/* eslint-disable no-console */
import LoggerInterface, { LogPayload } from '@lib/dictionary/application/ports/logger.interface';

export default class ConsoleLogger implements LoggerInterface {
	info(payload: { message: string; context: string }): void {
		console.info(`context: ${payload.context}, message: ${payload.message}`);
	}
	error(payload: { message: string; context: string }): void {
		console.warn(`context: ${payload.context}, message: ${payload.message}`);
	}
	warning(payload: { message: string; context: string }): void {
		console.warn(`context: ${payload.context}, message: ${payload.message}`);
	}
	critical(payload: { message: string; context: string }): void {
		console.error(`context: ${payload.context}, message: ${payload.message}`);
	}
	debug(payload: LogPayload): void {
		console.debug(`context: ${payload.context}, message: ${payload.message}`);
	}
}
