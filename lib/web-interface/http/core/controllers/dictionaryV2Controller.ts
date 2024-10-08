import { Request, Response, NextFunction } from 'express';
import DictionaryService from '@lib/dictionary/application/dictionary-v2-service';
import { CustomError } from '../middlewares/error-handler';
import TranslatorService from '@lib/dictionary/application/translator-service';
import { AsciiService } from '@lib/ascii/ascii-service';
import { DictionaryResponse } from '@lib/ascii/types';
import Logger from '@lib/dictionary/application/ports/logger.interface';

export default class DictionaryV2Controller {
	private dictionaryService: DictionaryService;
	private translatorService: TranslatorService;
	private asciiService: AsciiService;
	private logger: Logger;

	constructor(dictionaryService: DictionaryService, translatorService: TranslatorService, logger: Logger) {
		this.dictionaryService = dictionaryService;
		this.translatorService = translatorService;
		this.asciiService = new AsciiService(); // move to service factory
		this.logger = logger;
	}

	private getSearchResult = async (req: Request, next: NextFunction) => {
		const estonianWordResult = await this.getEstonianWord(req);

		if (!estonianWordResult) {
			return next(new CustomError('Something went wrong', 500));
		}

		if (estonianWordResult.estonianWord === '') {
			return next(new CustomError(`No Translation found for ${estonianWordResult.requestedWord}`, 400));
		}

		const translations = await this.getTranslations(req);

		const result = await this.dictionaryService.searchWordQuery(estonianWordResult.estonianWord);

		return {
			...estonianWordResult,
			searchResult: result,
			translations: [translations],
		} as DictionaryResponse;
	};

	searchWord = () => async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = await this.getSearchResult(req, next);
			res.json(result);
		} catch (err) {
			return next(new CustomError('Something went wrong', 500));
		}
	};

	ascii = () => async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = await this.getSearchResult(req, next);

			if (!result || !result?.searchResult.length) {
				res.send('no ascii for you!\n');
				return;
			}
			const ascii = this.asciiService.getAsciiResponse(result as DictionaryResponse);
			res.set('Content-Type', 'text/plain');
			res.send(ascii);
		} catch (err) {
			return next(new CustomError('Something went wrong', 500));
		}
	};

	getLucky = () => async (req: Request, res: Response, next: NextFunction) => {
		res.json({
			message: 'you got lucky',
		});
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

		this.logger.info({
			message: 'Incoming request',
			context: 'CONTROLLER_API_V2',
			requestedWord,
			language: lg ?? 'et',
		});

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
