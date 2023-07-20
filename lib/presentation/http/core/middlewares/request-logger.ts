import { Request, Response, NextFunction } from 'express';

const requestLogger = async (req: Request, res: Response, next: NextFunction) => {
	const logger = await req.requestLogger;
	try {
		await logger.logRequest(req);
	} catch (err) {
		req.logger.error({
			message: 'unable to log request',
			method: 'requestLogger',
			error: JSON.stringify(err),
		});
	}

	next();
};

export default requestLogger;
