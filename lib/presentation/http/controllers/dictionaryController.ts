import { Request, Response, NextFunction } from 'express';
import DictionaryService from '@lib/application/dictionary-service.js';

import { CustomError } from '@lib/presentation/http/middlewares/error-handler';

export default class DictionaryController {
	private dictionaryService: DictionaryService;

	constructor(dictionaryService: DictionaryService) {
		this.dictionaryService = dictionaryService;
	}

	getWord = () => async (req: Request, res: Response, next: NextFunction) => {
		const word = req?.params?.word;
		const wordResult = await this.dictionaryService.getWord(word);

		if (wordResult.isLeft()) {
			return next(new CustomError('Word InValid', 404));
		}

		return res.json(wordResult);
	};
}
