import { Request, Response } from 'express';
import DictionaryService from '@lib/application/dictionary-service.js';

export default class DictionaryController {
	private dictionaryService: DictionaryService;

	constructor(dictionaryService: DictionaryService) {
		this.dictionaryService = dictionaryService;
	}

	getWord = () => async (req: Request, res: Response) => {
		const word = req?.params?.word;
		const wordResult = await this.dictionaryService.getWord(word);

		return res.json(wordResult);
	};
}
