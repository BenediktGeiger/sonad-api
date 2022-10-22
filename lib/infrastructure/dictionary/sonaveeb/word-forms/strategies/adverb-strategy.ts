import { HTMLElement } from 'node-html-parser';
import { WordFormStrategy } from '@lib/infrastructure/dictionary/sonaveeb/word-forms';
import { AdverbForm } from '@lib/domain/dictionary-entry';

export default class AdverbStrategy implements WordFormStrategy {
	async getWordForms(tableElement: HTMLElement, partOfSpeech: string): Promise<AdverbForm | void> {
		if (partOfSpeech !== 'määrsõna') {
			return;
		}

		return this.evaluateAdverbTable(tableElement);
	}

	private evaluateAdverbTable(table: HTMLElement) {
		const tableCellElements = table.querySelectorAll('td');

		const tableCellValues = [...tableCellElements]
			.map((tableCell: HTMLElement) => tableCell?.textContent?.replace(/\s/g, '') ?? '')
			.filter((value) => value);

		return {
			muutumatu: tableCellValues[0],
		};
	}
}
