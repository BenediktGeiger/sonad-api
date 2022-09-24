import { ElementHandle, Page } from 'puppeteer';

export interface WordFormStrategy {
	getWordForms(page: Page, tableHandle: ElementHandle, partOfSpeech: string): Promise<object | void>;
}

export interface IWordFormsFinder {
	findWordForms(partOfSpeech: string, page: Page): object;
}

export default class WordFormsFinder implements IWordFormsFinder {
	private strategies: WordFormStrategy[];

	constructor(strategies: WordFormStrategy[]) {
		this.strategies = strategies;
	}
	// make return type dicrimanory union
	async findWordForms(partOfSpeech: string, page: Page): Promise<object> {
		const wordFormsTable = await page.$("[class*='morphology-paradigm'] table");
		let wordForms = {};
		if (wordFormsTable) {
			for (let i = 0; i < this.strategies.length; i++) {
				const forms = await this.strategies[i].getWordForms(page, wordFormsTable, partOfSpeech);

				if (forms) {
					wordForms = forms;
					break;
				}
			}
		}

		return wordForms;
	}
}
