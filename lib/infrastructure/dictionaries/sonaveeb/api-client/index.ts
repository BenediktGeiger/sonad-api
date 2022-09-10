import { basePath } from '@lib/infrastructure/dictionaries/sonaveeb/api-client/constants';
import urljoin from 'url-join';
import nodeFetch from 'node-fetch';
import fetchCookie from 'fetch-cookie';
import { Result } from '@lib/common/result';

const fetch = fetchCookie(nodeFetch);

type Request = {
	path: string;
	options: object;
};

export default class SonaVeebClient {
	readonly basePath: string;

	constructor() {
		this.basePath = basePath;
	}

	async request(request: Request) {
		const url = this.basePath + request.path;

		try {
			const response = await fetch(url, request.options);
			if (!response?.ok) {
				throw new Error('Something went wrong');
			}

			const responseValue = await response.text();
			return Result.ok(responseValue);
		} catch (err) {
			return Result.fail('Server Error');
		}
	}

	async getWordIdHtml({ word }: { word: string }) {
		const path = urljoin('search/unif/dlall/dsall', word);

		const request: Request = {
			path,
			options: {
				method: 'GET',
				redirect: 'follow',
				// credentials: 'same-origin',
			},
		};

		return this.request(request);
	}

	async getWordDetailsHtml({ wordId }: { wordId: string }) {
		const path = urljoin('worddetails/unif', wordId);

		const request: Request = {
			path,
			options: {
				method: 'GET',
			},
		};

		return this.request(request);
	}

	async getTableHtml({ paradigmId }: { paradigmId: string }) {
		const path = urljoin('morpho/lite', paradigmId, 'est');

		const request: Request = {
			path,
			options: {
				method: 'GET',
			},
		};

		return this.request(request);
	}
}
