import { HTMLElement } from 'node-html-parser';
import { WordFormStrategy } from '@lib/infrastructure/dictionary/sonaveeb/word-forms';
import { ComplementForm } from '@lib/domain/dictionary-entry';

export default class ComplementStrategy implements WordFormStrategy {
	async getWordForms(tableElement: HTMLElement, partOfSpeech: string): Promise<ComplementForm | void> {
		if (partOfSpeech === 'täiendsõna') {
			return this.evaluateComplementTable(tableElement);
		}
	}

	private evaluateComplementTable(table: HTMLElement) {
		const tableCellElements = table.querySelectorAll('td');

		const tableCellValues = [...tableCellElements]
			.map((tableCell: HTMLElement) => tableCell?.textContent?.replace(/\s/g, '') ?? '')
			.filter((value) => value);

		return {
			muutumatu: tableCellValues[0],
		};
	}
}
