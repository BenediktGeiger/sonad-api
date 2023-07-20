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
		const cachedDictionaryEntry = await this.dictionaryCache.get(searchTerm);

		if (cachedDictionaryEntry) {
			this.logger.info({
				message: `Cache hit with term:${searchTerm}`,
				method: 'getDictionaryEntry',
			});

			const dictionaryEntry = JSON.parse(cachedDictionaryEntry);

			return dictionaryEntry;
		}

		const result = await this.externalDictionary.getDictionaryEntry(searchTerm);

		if (result.length) {
			this.dictionaryCache.set(searchTerm, JSON.stringify(result));
		}

		return result;
	}
}
