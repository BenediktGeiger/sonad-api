import Logger from '@lib/dictionary/application/ports/logger.interface';
import DictionaryV2InMemory from './inMemory/dictionary-in-memory';
import ExternalDictionaryV2 from '@lib/dictionary/application/ports/external-dictionary-v2.interface';
import DictonaryEkilex from './ekilex/dictonary-ekilex';
import SonaVeebClient from '../dictionary/sonaveeb/api-client';
import { EkilexClient } from '@vanakaru/ekilex-api-client';
import config from '@lib/global-config';

export default {
	async getDictionary(logger: Logger): Promise<ExternalDictionaryV2> {
		const dictionary = config.dictionary.v2;
		const apiKey = config.ekilex.apiKey;
		const ekilexEnv: 'prod' | 'test' = config.ekilex.environment as 'prod' | 'test';
		if (dictionary === 'ekilex' && Boolean(apiKey)) {
			const client = new EkilexClient({
				apiKey: apiKey,
				environment: ekilexEnv,
			});

			const sonaveebClient = new SonaVeebClient(logger);

			return new DictonaryEkilex(logger, client, sonaveebClient);
		}

		return new DictionaryV2InMemory();
	},
};
