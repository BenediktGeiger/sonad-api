import { Request, Response, NextFunction } from 'express';
import DictionaryService from '@lib/application/dictionary-service.js';

import { WordResponse } from '@lib/application/dictionary-service.js';
import LoggerInterface from '@lib/application/ports/logger.interface';
import { CustomError } from '@lib/presentation/http/core/middlewares/error-handler';

export default class DictionaryController {
	private dictionaryService: DictionaryService;
	private logger: LoggerInterface;

	constructor(dictionaryService: DictionaryService, logger: LoggerInterface) {
		this.dictionaryService = dictionaryService;
		this.logger = logger;
	}

	getWord = () => async (req: Request, res: Response, next: NextFunction) => {
		const requestedWord = req?.params?.word;

		const result: WordResponse = await this.dictionaryService.getWord(requestedWord);

		if (result.isLeft()) {
			return next(new CustomError('Something went wrong', 500));
		}

		await this.setCache(req, result.payload);

		res.json(result.payload);
	};

	getPartOfSpeech = () => async (req: Request, res: Response, next: NextFunction) => {
		const requestedWord = req?.params?.word;

		const result: WordResponse = await this.dictionaryService.getWord(requestedWord);

		if (result.isLeft()) {
			return next(new CustomError('Something went wrong', 500));
		}

		await this.setCache(req, result.payload);

		const { word, partOfSpeech } = result.payload;

		return res.json({ word, partOfSpeech });
	};

	getWordForms = () => async (req: Request, res: Response, next: NextFunction) => {
		const requestedWord = req?.params?.word;

		const result: WordResponse = await this.dictionaryService.getWord(requestedWord);

		if (result.isLeft()) {
			return next(new CustomError('Something went wrong', 500));
		}

		await this.setCache(req, result.payload);

		const { word, wordForms } = result.payload;

		return res.json({ word, wordForms });
	};

	getMeanings = () => async (req: Request, res: Response, next: NextFunction) => {
		const requestedWord = req?.params?.word;

		const result: WordResponse = await this.dictionaryService.getWord(requestedWord);

		if (result.isLeft()) {
			return next(new CustomError('Something went wrong', 500));
		}

		await this.setCache(req, result.payload);

		const { word, meanings } = result.payload;

		return res.json({ word, meanings });
	};

	private async setCache(req: Request, payload: object) {
		const httpCacheTtl = process?.env?.HTTP_CACHE_TTL ?? 60;

		return req.cache.set(req.originalUrl, JSON.stringify(payload), Number(httpCacheTtl));
	}
}
