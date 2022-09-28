import { ElementHandle, Page } from 'puppeteer';
import { WordForm } from '@lib/domain/dictionary-entry';

export interface WordFormStrategy {
	getWordForms(page: Page, tableHandle: ElementHandle, partOfSpeech: string): Promise<WordForm | void>;
}

export default class WordFormsFinder {
	private strategies: WordFormStrategy[];

	constructor(strategies: WordFormStrategy[]) {
		this.strategies = strategies;
	}
	// make return type dicrimanory union
	async findWordForms(partOfSpeech: string, page: Page): Promise<WordForm | Record<string, never>> {
		const wordFormsTable = await page.$("[class*='morphology-paradigm'] table");

		if (!wordFormsTable) {
			return {};
		}

		for (let i = 0; i < this.strategies.length; i++) {
			const forms = await this.strategies[i].getWordForms(page, wordFormsTable, partOfSpeech);

			if (forms) {
				return forms;
			}
		}

		return {};
	}
}
