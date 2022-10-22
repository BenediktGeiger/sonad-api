import { Request, Response, NextFunction } from 'express';
import requestIp from 'request-ip';

import { CustomError } from '@lib/presentation/http/core/middlewares/error-handler';

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
	const clientIP = requestIp.getClientIp(req);
	const minute = new Date().getMinutes();

	const key = `${clientIP}:${minute}`;
	const hasReachedRateLimit = await req.rateLimiter.hasReachedRateLimit(key);

	if (hasReachedRateLimit) {
		next(new CustomError('Too many reqeusts', 429));
	}

	req.rateLimiter.incr(key);

	next();
};

export default rateLimiter;
