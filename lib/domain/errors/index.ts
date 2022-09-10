import { Result } from '@lib/common/result';

interface DomainError {
	message: string;
	error?: any;
}

export class UnexpectedDomainError extends Result<DomainError> {
	public constructor(err: any) {
		super(false, {
			message: 'An unexpected error occurde',
			error: err,
		});
	}

	public static create(err: any): UnexpectedDomainError {
		return new UnexpectedDomainError(err);
	}
}

export class WordInvalidError extends Result<DomainError> {
	public constructor(word: string) {
		super(false, {
			message: `The word ${word} is invalid`,
		});
	}

	public static create(word: string): WordInvalidError {
		return new WordInvalidError(word);
	}
}
