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

		const wordResult = await asyncStopWatch(
			this.dictionaryService.getWord.bind(this.dictionaryService),
			this.logger
		)(word);

		if (wordResult.isLeft()) {
			return next(new CustomError('Word InValid', 404));
		}

		return res.json(wordResult.value);
	};
}
