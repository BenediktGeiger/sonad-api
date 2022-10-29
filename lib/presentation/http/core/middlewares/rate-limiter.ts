import { Request, Response, NextFunction } from 'express';
import requestIp from 'request-ip';

import { CustomError } from '@lib/presentation/http/core/middlewares/error-handler';

const isWhiteListed = (clientIP: string): boolean => {
	const whiteListedIPs = String(process?.env?.IP_WHITELIST).split(',');

	if (whiteListedIPs.includes(clientIP)) {
		return true;
	}

	return false;
};

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
	const clientIP = requestIp.getClientIp(req);
	const minute = new Date().getMinutes();

	const key = `${clientIP}:${minute}`;

	if (isWhiteListed(String(clientIP))) {
		return next();
	}

	const hasReachedRateLimit = await req.rateLimiter.hasReachedRateLimit(key);

	if (hasReachedRateLimit) {
		next(new CustomError('Too many reqeusts', 429));
	}

	req.rateLimiter.incr(key);

	next();
};

export default rateLimiter;
