import { Request, Response } from 'express';
import DictionaryService from '@lib/application/dictionary-service.js';

import puppeteer from 'puppeteer';
export default class DictionaryController {
	private dictionaryService: DictionaryService;

	constructor(dictionaryService: DictionaryService) {
		this.dictionaryService = dictionaryService;
	}

	getWord = () => async (req: Request, res: Response) => {
		console.time('time');
		const word = req?.params?.word;
		const wordResult = await this.dictionaryService.getWord(word);
		console.timeEnd('time');
		return res.json(wordResult);
	};
}
