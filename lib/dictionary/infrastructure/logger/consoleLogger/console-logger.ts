/* eslint-disable no-console */
import LoggerInterface from '@lib/dictionary/application/ports/logger.interface';

export default class ConsoleLogger implements LoggerInterface {
	info(payload: { message: string; method: string }): void {
		console.info(`method: ${payload.method}, message: ${payload.message}`);
	}
	error(payload: { message: string; method: string }): void {
		console.warn(`method: ${payload.method}, message: ${payload.message}`);
	}
	warning(payload: { message: string; method: string }): void {
		console.warn(`method: ${payload.method}, message: ${payload.message}`);
	}
	critical(payload: { message: string; method: string }): void {
		console.error(`method: ${payload.method}, message: ${payload.message}`);
	}
}
