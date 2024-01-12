import { Request } from 'express';

export default interface RequestLogger {
	logRequest(req: Request): Promise<void>;
}
