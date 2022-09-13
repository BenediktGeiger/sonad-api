import DictionaryInMemory from '@lib/infrastructure/dictionaries/inMemory/dictionary-in-memory';
import Dictionary from '@lib/domain/dictionary';
import Logger from '@lib/domain/logger/logger-interface';
import DictionarySonaVeeb from '@lib/infrastructure/dictionaries/sonaveeb/dictonary-sonaveeb';

export default {
	getDictionary(logger: Logger): Dictionary {
		if (process.env.DICTIONARY === 'sonaveeb') {
			return new DictionarySonaVeeb(logger);
		}

		return new DictionaryInMemory();
	},
};
