import RequestLogger from '@lib/dictionary/application/ports/request-logger.interface';
import { Request } from 'express';

export default class ConsoleRequestLogger implements RequestLogger {
	async logRequest(req: Request): Promise<void> {
		console.log('Reqeust incoming', req.originalUrl);
	}
}
