import Dictionary from '@lib/domain/dictionary';
import DictionaryCache from '@lib/domain/cache-repository';
import { IDictionaryEntry } from '@lib/domain/dictionary-entry';

import { DictionaryResult, DictionaryResponse } from '@lib/domain/dictionary';
import Logger from '@lib/domain/logger/logger-interface';
import { partOfSpeechesTag, WordForm, Meaning } from '@lib/domain/dictionary-entry';

import { Either, left, right } from '@lib/common/either';

type ApplicationError = {
	message: string;
	error?: any;
};

type InvalidWord = {
	message: string;
};

type WordResult = {
	word: string;
	partOfSpeech: partOfSpeechesTag[];
	wordForms: WordForm;
	meanings: Meaning[];
	additionalInfo?: string;
};

type PartOfSpeechResult = {
	word: string;
	partOfSpeech: partOfSpeechesTag[] | null;
	additionalInfo?: string;
};

type WordFormsResult = {
	word: string;
	wordForms: WordForm | null;
	additionalInfo?: string;
};

type MeaningsResult = {
	word: string;
	meanings: Meaning[] | null;
	additionalInfo?: string;
};

type WordResponse = Either<ApplicationError | InvalidWord, WordResult>;
type PartofSpeechResponse = Either<ApplicationError | InvalidWord, PartOfSpeechResult>;
type WordFormsResponse = Either<ApplicationError | InvalidWord, WordFormsResult | DictionaryResult>;
type MeaningsResponse = Either<ApplicationError | InvalidWord, MeaningsResult | DictionaryResult>;

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

		const dictionaryEntry = dictionaryResponse.payload;

		const result: WordResult = {
			word: dictionaryEntry.getWord(),
			partOfSpeech: dictionaryEntry.getPartOfSpeech(),
			wordForms: dictionaryEntry.getWordForms(),
			meanings: dictionaryEntry.getMeanings(),
		};

		if (!this.dictionaryEntryExists(dictionaryEntry)) {
			return right({
				...result,
				additionalInfo: `The word ${word} doesn't exist in the dictionary`,
			});
		}

		return right(result);
	}

	async getPartOfSpeech(word: string): Promise<PartofSpeechResponse> {
		if (!word) {
			return left(this.handleInValidWordError());
		}

		const dictionaryResponse: DictionaryResponse = await this.dictionary.getWord(word);

		if (dictionaryResponse.isLeft()) {
			return left(this.handleApplicationError());
		}

		const dictionaryEntry = dictionaryResponse.payload;

		const result: PartOfSpeechResult = {
			word: dictionaryEntry.getWord(),
			partOfSpeech: dictionaryEntry.getPartOfSpeech(),
		};

		if (!this.dictionaryEntryExists(dictionaryEntry)) {
			return right({
				...result,
				additionalInfo: `The word ${word} doesn't exist in the dictionary`,
			});
		}

		return right(result);
	}

	async getWordForms(word: string): Promise<WordFormsResponse> {
		if (!word) {
			return left(this.handleInValidWordError());
		}

		const dictionaryResponse: DictionaryResponse = await this.dictionary.getWord(word);

		if (dictionaryResponse.isLeft()) {
			return left(this.handleApplicationError());
		}

		const dictionaryEntry = dictionaryResponse.payload;

		const result: WordFormsResult = {
			word: dictionaryEntry.getWord(),
			wordForms: dictionaryEntry.getWordForms(),
		};

		if (!this.dictionaryEntryExists(dictionaryEntry)) {
			return right({
				...result,
				additionalInfo: `The word ${word} doesn't exist in the dictionary`,
			});
		}

		return right(result);
	}

	async getMeanings(word: string): Promise<MeaningsResponse> {
		if (!word) {
			return left(this.handleInValidWordError());
		}

		const dictionaryResponse: DictionaryResponse = await this.dictionary.getWord(word);

		if (dictionaryResponse.isLeft()) {
			return left(this.handleApplicationError());
		}

		const dictionaryEntry = dictionaryResponse.payload;

		const result: MeaningsResult = {
			word: dictionaryEntry.getWord(),
			meanings: dictionaryEntry.getMeanings(),
		};

		if (!this.dictionaryEntryExists(dictionaryEntry)) {
			return right({
				...result,
				additionalInfo: `The word ${word} doesn't exist in the dictionary`,
			});
		}

		return right(result);
	}

	private dictionaryEntryExists(entry: IDictionaryEntry): boolean {
		return Boolean(entry.getPartOfSpeech().length);
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
