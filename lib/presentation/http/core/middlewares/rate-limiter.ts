import { Request, Response, NextFunction } from 'express';
import requestIp from 'request-ip';

import { CustomError } from '@lib/presentation/http/core/middlewares/error-handler';

const isWhiteListed = (origin: string): boolean => {
	const whiteListedDomains = String(process?.env?.WHITELIST).split(',');

	if (whiteListedDomains.includes(origin)) {
		return true;
	}

	return false;
};

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
	const clientIP = String(requestIp.getClientIp(req));
	const minute = new Date().getMinutes();

	const key = `${clientIP}:${minute}`;
	const origin = req.get('origin') ?? '';

	req.logger.info({
		message: `Request of ${clientIP} : ${origin}`,
		method: 'rateLimiter',
	});

	if (isWhiteListed(origin)) {
		req.logger.info({
			message: `${origin} is whitelisted`,
			method: 'rateLimiter',
		});
		return next();
	}

	const hasReachedRateLimit = await req.rateLimiter.hasReachedRateLimit(key);

	if (hasReachedRateLimit) {
		req.logger.info({
			message: `${clientIP} has reached limit`,
			method: 'rateLimiter',
		});
		return next(new CustomError('Too many reqeusts', 429));
	}

	req.rateLimiter.incr(key);

	next();
};

export default rateLimiter;
