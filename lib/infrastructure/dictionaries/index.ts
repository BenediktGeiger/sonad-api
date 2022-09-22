import DictionaryInMemory from '@lib/infrastructure/dictionaries/inMemory/dictionary-in-memory';
import Dictionary from '@lib/domain/dictionary';
import Logger from '@lib/domain/logger/logger-interface';
import DictionarySonaVeeb from '@lib/infrastructure/dictionaries/sonaveeb/dictonary-sonaveeb';
import WordFormsFinder from '@lib/infrastructure/dictionaries/sonaveeb/word-forms';
import NounStrategy from '@lib/infrastructure/dictionaries/sonaveeb/word-forms/strategies/noun-strategy';
import VerbStrategy from '@lib/infrastructure/dictionaries/sonaveeb/word-forms/strategies/verb-strategy';

export default {
	getDictionary(logger: Logger): Dictionary {
		if (process.env.DICTIONARY === 'sonaveeb') {
			const wordFormFinder = new WordFormsFinder([new NounStrategy(), new VerbStrategy()]);

			return new DictionarySonaVeeb(logger, wordFormFinder);
		}

		return new DictionaryInMemory();
	},
};
