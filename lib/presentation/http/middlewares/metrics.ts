import { Request, Response } from 'express';
import ResponseTime from 'response-time';

const metrics = (req: Request, res: Response, time: number) => {
	const { protocol, hostname, method, originalUrl } = req;
	const { statusCode } = res;

	req.logger.info({
		message: `Response of ${method} ${protocol}://${hostname}/${originalUrl} in ${time}ms with ${statusCode}`,
		method: 'listen',
	});
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Number} time
 */
const postProcess = (req: Request, res: Response, time: number) => () => {
	res.removeListener('finish', postProcess(req, res, time));
	metrics(req, res, time);
};

const metricsMiddleware = () =>
	ResponseTime((req: Request, res: Response, time: number) => {
		res.on('finish', postProcess(req, res, time));
	});

export default metricsMiddleware;
