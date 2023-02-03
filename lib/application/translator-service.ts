import Translator from '@lib/application/ports/translator.interface';
import Logger from '@lib/application/ports/logger.interface';
import { Either, left, right } from '@lib/shared/common/either';

type ApplicationError = {
	message: string;
	error?: any;
};

type InvalidWord = {
	message: string;
};

type TranslationResult = {
	originalWord: string;
	translatedWord: string;
};

export type TranslationResponse = Either<ApplicationError | InvalidWord, TranslationResult>;

export default class TranslatorService {
	private translator: Translator;
	private logger: Logger;

	constructor(translator: Translator, logger: Logger) {
		this.translator = translator;
		this.logger = logger;
	}

	async translateWord(word: string): Promise<TranslationResponse> {
		if (!word) {
			return left(this.handleInValidWordError());
		}

		const translatedWord = await this.translator.translate(word);

		if (translatedWord === null) {
			return left(this.handleApplicationError());
		}

		return right({
			originalWord: word,
			translatedWord,
		});
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
