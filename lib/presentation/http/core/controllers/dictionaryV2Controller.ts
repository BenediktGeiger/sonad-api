import { Request, Response, NextFunction } from 'express';
import LoggerInterface from '@lib/application/ports/logger.interface';
import DictionaryService from '@lib/application/dictionary-v2-service';
import { CustomError } from '../middlewares/error-handler';
import TranslatorService from '@lib/application/translator-service';

export default class DictionaryV2Controller {
	private logger: LoggerInterface;
	private dictionaryService: DictionaryService;
	private translatorService: TranslatorService;

	constructor(logger: LoggerInterface, dictionaryService: DictionaryService, translatorService: TranslatorService) {
		this.dictionaryService = dictionaryService;
		this.translatorService = translatorService;
		this.logger = logger;
	}

	searchWord = () => async (req: Request, res: Response, next: NextFunction) => {
		const estonianWordResult = await this.getEstonianWord(req);

		if (!estonianWordResult) {
			return next(new CustomError('Something went wrong', 500));
		}

		if (estonianWordResult.estonianWord === '') {
			return next(new CustomError(`No Translation found for ${estonianWordResult.requestedWord}`, 400));
		}

		const translations = await this.getTranslations(req);

		try {
			const result = await this.dictionaryService.getWord(estonianWordResult.estonianWord);
			res.json({
				...estonianWordResult,
				searchResult: result,
				translations: [translations],
			});
		} catch (err) {
			return next(new CustomError('Something went wrong', 500));
		}
	};

	private getTranslationDirection(lg?: any): { from: string; to: string } {
		if (!lg || lg === 'et') {
			return {
				from: 'et',
				to: 'en',
			};
		}

		if (lg === 'en') {
			return {
				from: 'en',
				to: 'et',
			};
		}

		return {
			from: 'et',
			to: 'en',
		};
	}

	private async getTranslations(req: Request): Promise<{
		from: string;
		to: string;
		input: string;
		translations: string[];
	}> {
		const requestedWord = req?.params?.searchTerm;

		const { lg } = req.query;

		const { from, to } = this.getTranslationDirection(lg);

		const translations = await this.translatorService.getTranslations(requestedWord, from, to);

		if (translations.isLeft()) {
			return {
				from,
				to,
				input: requestedWord,
				translations: [],
			};
		}

		return {
			from,
			to,
			input: requestedWord,
			translations: translations?.payload?.translations ?? [],
		};
	}

	private async getEstonianWord(req: Request): Promise<{
		requestedWord: string;
		estonianWord: string;
	} | null> {
		const requestedWord = req?.params?.searchTerm;

		const { lg } = req.query;

		if (!lg || lg === 'et') {
			return {
				requestedWord,
				estonianWord: requestedWord,
			};
		}

		const translationResponse = await this.translatorService.translateWord(requestedWord);

		if (translationResponse.isLeft()) {
			return null;
		}

		return {
			requestedWord,
			estonianWord: translationResponse.payload.translatedWord,
		};
	}
}
