import Logger from '@lib/application/ports/logger.interface';

import ExternalDictionaryV2 from './ports/external-dictionary-v2.interface';
import DictionaryCache from '@lib/application/ports/dictionary-cache.interface';

export type WordResponse = {
	[key in string]: any;
}[];

export default class DictionaryV2Service {
	private externalDictionary: ExternalDictionaryV2;
	private logger: Logger;
	private dictionaryCache: DictionaryCache;

	constructor(externalDictionary: ExternalDictionaryV2, dictionaryCache: DictionaryCache, logger: Logger) {
		this.externalDictionary = externalDictionary;
		this.logger = logger;
		this.dictionaryCache = dictionaryCache;
	}

	async getWord(searchTerm: string): Promise<WordResponse> {
		return this.getDictionaryEntry(searchTerm);
	}

	private async getDictionaryEntry(searchTerm: string): Promise<WordResponse> {
		const cacheKey = `${searchTerm}_v2`;
		const cachedDictionaryEntry = await this.dictionaryCache.get(cacheKey);

		if (cachedDictionaryEntry) {
			this.logger.info({
				message: `Cache hit with term:${searchTerm}`,
				method: 'getDictionaryEntry',
			});
			try {
				const dictionaryEntry = JSON.parse(cachedDictionaryEntry);
				return dictionaryEntry;
			} catch (error) {
				this.logger.error({
					message: `Unable to parse cache entry`,
					method: 'getDictionaryEntry',
				});

				const result = await this.externalDictionary.getDictionaryEntry(searchTerm);

				if (result.length) {
					this.dictionaryCache.set(cacheKey, JSON.stringify(result));
				}

				return result;
			}
		}

		const result = await this.externalDictionary.getDictionaryEntry(searchTerm);

		if (result.length) {
			this.dictionaryCache.set(cacheKey, JSON.stringify(result));
		}

		return result;
	}
}
