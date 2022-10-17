import DictionaryInMemory from '@lib/infrastructure/dictionaries/inMemory/dictionary-in-memory';
import Dictionary from '@lib/domain/dictionary';
import Logger from '@lib/domain/logger/logger-interface';
import DictionarySonaVeeb from '@lib/infrastructure/dictionaries/sonaveeb/dictonary-sonaveeb';
import WordFormsFinder from '@lib/infrastructure/dictionaries/sonaveeb/word-forms';
import { BrowserSingleton } from '@lib/infrastructure/dictionaries/sonaveeb/browser';
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
} from '@lib/infrastructure/dictionaries/sonaveeb/word-forms/strategies';

export default {
	async getDictionary(logger: Logger): Promise<Dictionary> {
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

			const browser = await BrowserSingleton.getBrowser();

			return new DictionarySonaVeeb(logger, wordFormFinder, browser);
		}

		return new DictionaryInMemory();
	},
};
