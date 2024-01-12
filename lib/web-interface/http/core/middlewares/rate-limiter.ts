import { Request, Response, NextFunction } from 'express';
import requestIp from 'request-ip';

import { CustomError } from '@lib/web-interface/http/core/middlewares/error-handler';

const isWhiteListed = (origin: string): boolean => {
	const whiteListedDomains = String(process?.env?.WHITELIST).split(',');

	if (whiteListedDomains.includes(origin)) {
		return true;
	}

	return false;
};

const getRateLimit = (originalUrl: string): number | string => {
	if (originalUrl.includes('v1/')) {
		return process?.env?.RATE_LIMIT_V1 ?? 60;
	}

	return process?.env?.RATE_LIMIT_V2 ?? 60;
};

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
	const clientIP = String(requestIp.getClientIp(req));
	const minute = new Date().getMinutes();

	const key = `${clientIP}:${minute}`;
	const origin = req.get('origin') ?? '';

	const { originalUrl } = req;

	req.logger.info({
		message: `Request of ${clientIP} : ${origin}`,
		method: 'rateLimiter',
		clientIp: clientIP,
		origin,
	});

	if (isWhiteListed(origin)) {
		req.logger.info({
			message: `${origin} is whitelisted`,
			method: 'rateLimiter',
			origin,
		});
		return next();
	}

	const rateLimit = Number(getRateLimit(originalUrl));

	const hasReachedRateLimit = await req.rateLimiter.hasReachedRateLimit(key, rateLimit);

	if (hasReachedRateLimit) {
		req.logger.info({
			message: `${clientIP} has reached limit`,
			method: 'rateLimiter',
			clientIp: clientIP,
			origin,
		});
		return next(
			new CustomError(
				'Too many requests, please switch to api version v2. version v1 is heavily rate limited and will soon be shut down',
				429
			)
		);
	}

	req.rateLimiter.incr(key);

	next();
};

export default rateLimiter;
