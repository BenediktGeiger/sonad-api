import { WordForm } from '@lib/dictionary/domain/dictionary-entry';
import { HTMLElement } from 'node-html-parser';

export interface WordFormStrategy {
	getWordForms(tableElement: HTMLElement, partOfSpeech: string): Promise<WordForm | void>;
}

export default class WordFormsFinder {
	private strategies: WordFormStrategy[];

	constructor(strategies: WordFormStrategy[]) {
		this.strategies = strategies;
	}
	// make return type dicrimanory union
	async findWordForms(partOfSpeech: string, root: HTMLElement): Promise<WordForm | Record<string, never>> {
		const wordFormsTableElement = root.querySelector("[class*='morphology-paradigm'] table");

		if (!wordFormsTableElement) {
			return {};
		}

		for (let i = 0; i < this.strategies.length; i++) {
			const forms = await this.strategies[i].getWordForms(wordFormsTableElement, partOfSpeech);

			if (forms) {
				return forms;
			}
		}

		return {};
	}
}
