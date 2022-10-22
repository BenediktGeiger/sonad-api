import { basePath } from '@lib/infrastructure/dictionary/sonaveeb/api-client/constants';
import LoggerInterface from '@lib/application/ports/logger.interface';
import urljoin from 'url-join';
import nodeFetch from 'node-fetch';
import fetchCookie from 'fetch-cookie';

const fetch = fetchCookie(nodeFetch);

type Request = {
	path: string;
	options: object;
};

export default class SonaVeebClient {
	readonly basePath: string;
	private logger: LoggerInterface;

	constructor(logger: LoggerInterface) {
		this.basePath = basePath;
		this.logger = logger;
	}

	async request(request: Request) {
		const url = this.basePath + request.path;

		try {
			const response = await fetch(url, request.options);
			if (!response?.ok) {
				throw new Error('Unable to reach sonavee.ee');
			}

			return await response.text();
		} catch (err) {
			this.logger.error({
				message: JSON.stringify(err),
				method: 'request',
			});
			throw err;
		}
	}

	async getResultPage(word: string) {
		const path = urljoin(`/search/unif/est/eki/${word}/1`);

		const request: Request = {
			path,
			options: {
				method: 'GET',
				redirect: 'follow',
			},
		};

		return this.request(request);
	}

	async getWordDetailsHtml(wordId: string) {
		const path = urljoin('worddetails/unif', wordId);

		const request: Request = {
			path,
			options: {
				method: 'GET',
			},
		};

		return this.request(request);
	}
}
