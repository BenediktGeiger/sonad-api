import { Request, Response, NextFunction } from 'express';
import DictionaryService from '@lib/application/dictionary-service.js';
import TranslatorService from '@lib/application/translator-service';

import { WordResponse } from '@lib/application/dictionary-service.js';
import LoggerInterface from '@lib/application/ports/logger.interface';
import { CustomError } from '@lib/presentation/http/core/middlewares/error-handler';

export default class DictionaryController {
	private dictionaryService: DictionaryService;
	private translatorService: TranslatorService;
	private logger: LoggerInterface;

	constructor(dictionaryService: DictionaryService, translatorService: TranslatorService, logger: LoggerInterface) {
		this.dictionaryService = dictionaryService;
		this.translatorService = translatorService;
		this.logger = logger;
	}

	getWord = () => async (req: Request, res: Response, next: NextFunction) => {
		const estonianWordResult = await this.getEstonianWord(req);

		if (!estonianWordResult) {
			return next(new CustomError('Something went wrong', 500));
		}

		if (estonianWordResult.estonianWord === '') {
			return next(new CustomError(`No Translation found for ${estonianWordResult.requestedWord}`, 400));
		}

		const result: WordResponse = await this.dictionaryService.getWord(estonianWordResult.estonianWord);

		if (result.isLeft()) {
			return next(new CustomError('Something went wrong', 500));
		}

		await this.setCache(req, result.payload);

		res.json(result.payload);
	};

	getPartOfSpeech = () => async (req: Request, res: Response, next: NextFunction) => {
		const estonianWordResult = await this.getEstonianWord(req);

		if (!estonianWordResult) {
			return next(new CustomError('Something went wrong', 500));
		}

		if (estonianWordResult.estonianWord === '') {
			return next(new CustomError(`No Translation found for ${estonianWordResult.requestedWord}`, 400));
		}

		const result: WordResponse = await this.dictionaryService.getWord(estonianWordResult.estonianWord);

		if (result.isLeft()) {
			return next(new CustomError('Something went wrong', 500));
		}

		await this.setCache(req, result.payload);

		const { word, partOfSpeech, additionalInfo } = result.payload;

		return res.json({ word, partOfSpeech, additionalInfo });
	};

	getWordForms = () => async (req: Request, res: Response, next: NextFunction) => {
		const estonianWordResult = await this.getEstonianWord(req);

		if (!estonianWordResult) {
			return next(new CustomError('Something went wrong', 500));
		}

		if (estonianWordResult.estonianWord === '') {
			return next(new CustomError(`No Translation found for ${estonianWordResult.requestedWord}`, 400));
		}

		const result: WordResponse = await this.dictionaryService.getWord(estonianWordResult.estonianWord);

		if (result.isLeft()) {
			return next(new CustomError('Something went wrong', 500));
		}

		await this.setCache(req, result.payload);

		const { word, wordForms, additionalInfo } = result.payload;

		return res.json({ word, wordForms, additionalInfo });
	};

	getMeanings = () => async (req: Request, res: Response, next: NextFunction) => {
		const estonianWordResult = await this.getEstonianWord(req);

		if (!estonianWordResult) {
			return next(new CustomError('Something went wrong', 500));
		}

		if (estonianWordResult.estonianWord === '') {
			return next(new CustomError(`No Translation found for ${estonianWordResult.requestedWord}`, 400));
		}

		const result: WordResponse = await this.dictionaryService.getWord(estonianWordResult.estonianWord);

		if (result.isLeft()) {
			return next(new CustomError('Something went wrong', 500));
		}

		await this.setCache(req, result.payload);

		const { word, meanings, additionalInfo } = result.payload;

		return res.json({ word, meanings, additionalInfo });
	};

	private async setCache(req: Request, payload: object) {
		const httpCacheTtl = process?.env?.HTTP_CACHE_TTL ?? 60;

		return req.cache.set(req.originalUrl, JSON.stringify(payload), Number(httpCacheTtl));
	}

	private async getEstonianWord(req: Request): Promise<{
		requestedWord: string;
		estonianWord: string;
	} | null> {
		const requestedWord = req?.params?.word;

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
