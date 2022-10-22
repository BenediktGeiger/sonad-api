import { IDictionaryEntry } from '@lib/domain/dictionary-entry';

import { Either } from '@lib/shared/common/either';

type NotInDictionaryResult = {
	word: string;
};

export type DictionaryResult = {
	dictionaryEntry: IDictionaryEntry | NotInDictionaryResult;
	entryExists: boolean;
};

export type DomainError = {
	message: string;
	error?: any;
};

export type DictionaryResponse = Either<DomainError, IDictionaryEntry>;

export default interface Dictionary {
	getWord(word: string): Promise<DictionaryResponse>;
}
