import { HTMLElement } from 'node-html-parser';
import { WordFormStrategy } from '@lib/infrastructure/dictionaries/sonaveeb/word-forms';
import { ConjunctionForm } from '@lib/domain/dictionary-entry';

export default class ConjunctionStrategy implements WordFormStrategy {
	async getWordForms(tableElement: HTMLElement, partOfSpeech: string): Promise<ConjunctionForm | void> {
		if (partOfSpeech !== 'sidesõna') {
			return;
		}

		return this.evaluateConjunctionTable(tableElement);
	}

	private evaluateConjunctionTable(table: HTMLElement) {
		const tableCellElements = table.querySelectorAll('td');

		const tableCellValues = [...tableCellElements]
			.map((tableCell: HTMLElement) => tableCell?.textContent?.replace(/\s/g, '') ?? '')
			.filter((value) => value);

		return {
			muutumatu: tableCellValues[0],
		};
	}
}
