import { HTMLElement } from 'node-html-parser';
import { WordFormStrategy } from '@lib/infrastructure/dictionaries/sonaveeb/word-forms';
import { ExclamationForm } from '@lib/domain/dictionary-entry';

export default class ExclamationStrategy implements WordFormStrategy {
	async getWordForms(tableElement: HTMLElement, partOfSpeech: string): Promise<ExclamationForm | void> {
		if (partOfSpeech !== 'hüüdsõna') {
			return;
		}

		return this.evaluateExclamationTable(tableElement);
	}

	private evaluateExclamationTable(table: HTMLElement) {
		const tableCellElements = table.querySelectorAll('td');

		const tableCellValues = [...tableCellElements]
			.map((tableCell: HTMLElement) => tableCell?.textContent?.replace(/\s/g, '') ?? '')
			.filter((value) => value);

		return {
			muutumatu: tableCellValues[0],
		};
	}
}
