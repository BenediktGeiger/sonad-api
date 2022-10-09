import Dictionary from '@lib/domain/dictionary';
import DictionaryCache from '@lib/domain/cache-repository';

import { DictionaryResponse } from '@lib/domain/dictionary';
import { InvalidDictionaryResponse, ValidDictionaryResponse } from '@lib/domain/dictionary';
import Logger from '@lib/domain/logger/logger-interface';
import { partOfSpeechesTag, WordForm, Meaning } from '@lib/domain/dictionary-entry';

import { Either, left, right, Left } from '@lib/common/either';

type ApplicationError = {
	message: string;
	error?: any;
};

type InvalidWord = {
	message: string;
};

type PartOfSpeechResult = {
	value: partOfSpeechesTag[];
};

type WordFormsResult = {
	value: WordForm;
};

type MeaningsResult = {
	value: WordForm[];
};

type WordResponse = Either<ApplicationError | InvalidWord, ValidDictionaryResponse | InvalidDictionaryResponse>;
type PartofSpeechResponse = Either<ApplicationError | InvalidWord, PartOfSpeechResult | InvalidDictionaryResponse>;
type WordFormsResponse = Either<ApplicationError | InvalidWord, WordFormsResult | InvalidDictionaryResponse>;
type MeaningsResponse = Either<ApplicationError | InvalidWord, MeaningsResult | InvalidDictionaryResponse>;

export default class DictionaryService {
	private dictionary: Dictionary;
	private logger: Logger;
	constructor({ dictionary, logger }: { dictionary: Dictionary; cacheRepository: DictionaryCache; logger: Logger }) {
		this.dictionary = dictionary;
		this.logger = logger;
	}

	async getWord(word: string): Promise<WordResponse> {
		if (!word) {
			return left(this.handleInValidWordError());
		}

		const dictionaryResponse: DictionaryResponse = await this.dictionary.getWord(word);

		if (dictionaryResponse.isLeft()) {
			return left(this.handleApplicationError());
		}

		return right(dictionaryResponse.payload);
	}

	async getPartOfSpeech(word: string): Promise<PartofSpeechResponse> {
		if (!word) {
			return left(this.handleInValidWordError());
		}

		const dictionaryResponse: DictionaryResponse = await this.dictionary.getWord(word);

		if (dictionaryResponse.isLeft()) {
			return left(this.handleApplicationError());
		}

		if (!this.isValidDictionaryEntry(dictionaryResponse)) {
			return right({
				message: `The word ${word} is not in the dictionary`,
				value: null,
			});
		}

		const dictionaryEntry = dictionaryResponse?.payload?.value;

		if (!dictionaryEntry?.partOfSpeech) {
			return left(this.handleApplicationError());
		}

		return right({ value: dictionaryEntry.partOfSpeech });
	}

	async getWordForms(word: string): Promise<WordFormsResponse> {
		if (!word) {
			return left(this.handleInValidWordError());
		}

		const dictionaryResponse: DictionaryResponse = await this.dictionary.getWord(word);

		if (dictionaryResponse.isLeft()) {
			return left(this.handleApplicationError());
		}

		if (!this.isValidDictionaryEntry(dictionaryResponse)) {
			return right({
				message: `The word ${word} is not in the dictionary`,
				value: null,
			});
		}

		const dictionaryEntry = dictionaryResponse?.payload?.value;

		if (!dictionaryEntry?.wordForms) {
			return left(this.handleApplicationError());
		}

		return right({ value: dictionaryEntry.wordForms });
	}

	async getMeanings(word: string): Promise<MeaningsResponse> {
		if (!word) {
			return left(this.handleInValidWordError());
		}

		const dictionaryResponse: DictionaryResponse = await this.dictionary.getWord(word);

		if (dictionaryResponse.isLeft()) {
			return left(this.handleApplicationError());
		}

		if (!this.isValidDictionaryEntry(dictionaryResponse)) {
			return right({
				message: `The word ${word} is not in the dictionary`,
				value: null,
			});
		}

		const dictionaryEntry = dictionaryResponse?.payload?.value;

		if (!dictionaryEntry?.meanings) {
			return left(this.handleApplicationError());
		}

		return right({ value: dictionaryEntry.meanings });
	}

	private isValidDictionaryEntry(response: any): response is ValidDictionaryResponse {
		return Boolean(response.payload.value);
	}

	private handleInValidWordError(): InvalidWord {
		return {
			message: 'The word must have a value',
		};
	}

	private handleApplicationError(): ApplicationError {
		return {
			message: 'An unexpected error occured',
		};
	}
}
