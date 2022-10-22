import { HTMLElement } from 'node-html-parser';
import { WordFormStrategy } from '@lib/infrastructure/dictionary/sonaveeb/word-forms';
import { PrePostPositionForm } from '@lib/domain/dictionary-entry';

export default class PrePostPositionsStrategy implements WordFormStrategy {
	async getWordForms(tableElement: HTMLElement, partOfSpeech: string): Promise<PrePostPositionForm | void> {
		if (partOfSpeech === 'eessõna' || partOfSpeech === 'tagasõna') {
			return this.evaluatePrePostPositionTable(tableElement);
		}
	}

	private evaluatePrePostPositionTable(table: HTMLElement) {
		const tableCellElements = table.querySelectorAll('td');

		const tableCellValues = [...tableCellElements]
			.map((tableCell: HTMLElement) => tableCell?.textContent?.replace(/\s/g, '') ?? '')
			.filter((value) => value);

		return {
			muutumatu: tableCellValues[0],
		};
	}
}
