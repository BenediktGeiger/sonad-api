import { UnexpectedDomainError, WordInvalidError } from '@lib/domain/errors';
import DictionaryEntry from '@lib/domain/dictionary-entry';

import { Either } from '@lib/common/either';

export type Response = Either<UnexpectedDomainError | WordInvalidError, DictionaryEntry>;

export default interface Dictionary {
	getWord(word: string): Promise<Response>;
}
