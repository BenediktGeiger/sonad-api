import { HTMLElement } from 'node-html-parser';
import { WordFormStrategy } from '@lib/infrastructure/dictionary/sonaveeb/word-forms';
import { UnknownForm } from '@lib/domain/dictionary-entry';

export default class NounStrategy implements WordFormStrategy {
	async getWordForms(tableElement: HTMLElement, partOfSpeech: string): Promise<UnknownForm | void> {
		return this.evaluateDefaultTable(tableElement);
	}

	private evaluateDefaultTable(table: HTMLElement) {
		const tableCellElements = table.querySelectorAll('td');

		const tableCellValues = [...tableCellElements]
			.map((tableCell: HTMLElement) => tableCell?.textContent?.replace(/\s/g, '') ?? '')
			.filter((value) => value);

		return { ...tableCellValues };
	}
}
