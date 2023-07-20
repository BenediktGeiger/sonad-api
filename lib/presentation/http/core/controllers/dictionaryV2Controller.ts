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

		try {
			const result = await this.dictionaryService.getWord(estonianWordResult.estonianWord);
			res.json({
				...estonianWordResult,
				searchResult: result,
			});
		} catch (err) {
			return next(new CustomError('Something went wrong', 500));
		}
	};

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
