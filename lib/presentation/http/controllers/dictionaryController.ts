import { Request, Response } from 'express';
import DictionaryService from '@lib/application/dictionary-service.js';
export default class DictionaryController {
	private dictionaryService: DictionaryService;

	constructor(dictionaryService: DictionaryService) {
		this.dictionaryService = dictionaryService;
	}

	getGrammaticalCasesAction = () => async (req: Request, res: Response) => {
		console.time('time');
		const word = req?.params?.word;
		const wordResult = await this.dictionaryService.getGrammaticalCases(word);
		console.timeEnd('time');
		return res.json(wordResult);
	};
}
