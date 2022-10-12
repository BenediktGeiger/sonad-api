import { Request, Response, NextFunction } from 'express';
import DictionaryService from '@lib/application/dictionary-service.js';
import LoggerInterface from '@lib/domain/logger/logger-interface';
import { asyncStopWatch } from '@lib/common/stop-watch';
import { CustomError } from '@lib/presentation/http/middlewares/error-handler';

export default class DictionaryController {
	private dictionaryService: DictionaryService;
	private logger: LoggerInterface;

	constructor(dictionaryService: DictionaryService, logger: LoggerInterface) {
		this.dictionaryService = dictionaryService;
		this.logger = logger;
	}

	getWord = () => async (req: Request, res: Response, next: NextFunction) => {
		const word = req?.params?.word;

		const result = await asyncStopWatch(
			this.dictionaryService.getWord.bind(this.dictionaryService),
			this.logger
		)(word);

		if (result.isLeft()) {
			return next(new CustomError('Something went wrong', 500));
		}

		await req.cache.set(req.originalUrl, JSON.stringify(result.payload));

		res.json(result.payload);
	};

	getPartOfSpeech = () => async (req: Request, res: Response, next: NextFunction) => {
		const word = req?.params?.word;

		const result = await asyncStopWatch(
			this.dictionaryService.getPartOfSpeech.bind(this.dictionaryService),
			this.logger
		)(word);

		if (result.isLeft()) {
			return next(new CustomError('Something went wrong', 500));
		}

		await req.cache.set(req.originalUrl, JSON.stringify(result.payload));

		return res.json(result.payload);
	};

	getWordForms = () => async (req: Request, res: Response, next: NextFunction) => {
		const word = req?.params?.word;

		const result = await asyncStopWatch(
			this.dictionaryService.getWordForms.bind(this.dictionaryService),
			this.logger
		)(word);

		if (result.isLeft()) {
			return next(new CustomError('Something went wrong', 500));
		}

		await req.cache.set(req.originalUrl, JSON.stringify(result.payload));

		return res.json(result.payload);
	};

	getMeanings = () => async (req: Request, res: Response, next: NextFunction) => {
		const word = req?.params?.word;

		const result = await asyncStopWatch(
			this.dictionaryService.getMeanings.bind(this.dictionaryService),
			this.logger
		)(word);

		if (result.isLeft()) {
			return next(new CustomError('Something went wrong', 500));
		}

		await req.cache.set(req.originalUrl, JSON.stringify(result.payload));

		return res.json(result.payload);
	};
}
