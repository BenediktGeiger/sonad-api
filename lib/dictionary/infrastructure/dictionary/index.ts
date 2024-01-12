import DictionaryInMemory from '@lib/dictionary/infrastructure/dictionary/inMemory/dictionary-in-memory';
import ExternalDictionary from '@lib/dictionary/application/ports/external-dictionary.interface';
import Logger from '@lib/dictionary/application/ports/logger.interface';
import DictionarySonaVeeb from '@lib/dictionary/infrastructure/dictionary/sonaveeb/dictonary-sonaveeb';
import WordFormsFinder from '@lib/dictionary/infrastructure/dictionary/sonaveeb/word-forms';
import {
	NounStrategy,
	VerbStrategy,
	AdjectiveStrategy,
	AdverbStrategy,
	PronounStrategy,
	NumberWordStrategy,
	ExclamationStrategy,
	ConjunctionStrategy,
	PrePostPositionStrategy,
	ComplementStrategy,
	DefaultStrategy,
} from '@lib/dictionary/infrastructure/dictionary/sonaveeb/word-forms/strategies';
import SonaVeebClient from '@lib/dictionary/infrastructure/dictionary/sonaveeb/api-client';

export default {
	async getDictionary(logger: Logger): Promise<ExternalDictionary> {
		if (process.env.DICTIONARY === 'sonaveeb') {
			const wordFormFinder = new WordFormsFinder([
				new NounStrategy(),
				new VerbStrategy(),
				new AdjectiveStrategy(),
				new AdverbStrategy(),
				new PronounStrategy(),
				new NumberWordStrategy(),
				new ExclamationStrategy(),
				new ConjunctionStrategy(),
				new PrePostPositionStrategy(),
				new ComplementStrategy(),
				new DefaultStrategy(),
			]);

			const sonaVeebClient = new SonaVeebClient(logger);

			return new DictionarySonaVeeb(logger, wordFormFinder, sonaVeebClient);
		}

		return new DictionaryInMemory();
	},
};
