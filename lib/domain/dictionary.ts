import { IDictionaryEntry } from '@lib/domain/dictionary-entry';

import { Either } from '@lib/common/either';

export type InvalidDictionaryResponse = {
	message: string;
	value: null;
};

export type ValidDictionaryResponse = {
	value: IDictionaryEntry;
};

export type DomainError = {
	message: string;
	error?: any;
};

export type DictionaryResponse = Either<DomainError, InvalidDictionaryResponse | ValidDictionaryResponse>;

export default interface Dictionary {
	getWord(word: string): Promise<DictionaryResponse>;
}
