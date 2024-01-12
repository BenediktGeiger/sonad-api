import Logger from '@lib/dictionary/application/ports/logger.interface';
import DictionaryV2InMemory from './inMemory/dictionary-in-memory';
import ExternalDictionaryV2 from '@lib/dictionary/application/ports/external-dictionary-v2.interface';
import DictonaryEkilex from './ekilex/dictonary-ekilex';
import SonaVeebClient from '../dictionary/sonaveeb/api-client';
import { EkilexClient } from '@vanakaru/ekilex-api-client';

export default {
	async getDictionary(logger: Logger): Promise<ExternalDictionaryV2> {
		const dictionary = process.env.DICTIONARYV2;
		const apiKey = String(process.env.EKILEX_API_KEY);
		const ekilexEnv: 'prod' | 'test' = String(process.env.EKILEX_API_ENVIRONMENT) as 'prod' | 'test';
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
