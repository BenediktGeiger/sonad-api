import { Request, Response } from 'express';
import ResponseTime from 'response-time';

import { requestCounter, requestDuration } from '@lib/web-interface/http/core/prom';

const values = Object.freeze(['v1', 'wordforms', 'meanings', 'partofspeech', 'metrics']);

const normalizePath = (originalUrl: string) => {
	const chunks = originalUrl
		.split('/')
		.filter((chunk) => chunk !== '')
		.map((chunk) => chunk.toLowerCase());

	const valueIndexes: number[] = [];
	for (let i = 0; i < chunks.length; i++) {
		if (!values.includes(chunks[i])) {
			valueIndexes.push(i);
		}
	}

	return '/' + chunks.map((chunk, i) => (valueIndexes.indexOf(i) >= 0 ? ':word' : chunk)).join('/');
};

const metrics = (req: Request, res: Response, time: number) => {
	const { protocol, hostname, method, originalUrl } = req;
	const { statusCode } = res;

	const normalizedPath = normalizePath(originalUrl);

	if (normalizedPath.includes('metrics')) {
		return;
	}
	req?.logger?.info({
		message: `Response of ${method} ${protocol}://${hostname}${originalUrl} in ${time}ms with ${statusCode}`,
		method: 'listen',
		protocol,
		hostname,
		originalUrl,
		statusCode,
	});

	const labels = {
		route: normalizedPath,
		method,
		statusCode,
	};

	requestCounter.inc(labels, 1);
	requestDuration.observe(labels, time);
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
