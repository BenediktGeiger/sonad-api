import { Request, Response, NextFunction } from 'express';

const cacheHandler = async (req: Request, res: Response, next: NextFunction) => {
	const cachedResponse = process.env.CACHE ? await req.cache.get(req.originalUrl) : null;

	if (cachedResponse) {
		req.logger.info({
			message: 'Found cached response',
			method: 'cacheHandler',
		});
		return res.json(JSON.parse(cachedResponse));
	}

	next();
};

export default cacheHandler;
