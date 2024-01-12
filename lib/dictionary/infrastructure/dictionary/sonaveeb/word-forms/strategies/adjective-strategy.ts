import { HTMLElement } from 'node-html-parser';
import { WordFormStrategy } from '@lib/dictionary/infrastructure/dictionary/sonaveeb/word-forms';
import { AdjectiveForm } from '@lib/dictionary/domain/dictionary-entry';
export default class AdjectiveStrategy implements WordFormStrategy {
	async getWordForms(tableElement: HTMLElement, partOfSpeech: string): Promise<AdjectiveForm | void> {
		if (partOfSpeech !== 'omadussõna') {
			return;
		}

		return this.evaluateAdjectiveTable(tableElement);
	}

	private evaluateAdjectiveTable(table: HTMLElement) {
		const tableCellElements = table.querySelectorAll('td');

		const tableCellValues = [...tableCellElements]
			.map((tableCell: HTMLElement) => tableCell?.textContent?.replace(/\s/g, '') ?? '')
			.filter((value) => value);

		return {
			singular: {
				nimetav: tableCellValues[0],
				omastav: tableCellValues[2],
				osastav: tableCellValues[4],
			},
			plural: {
				nimetav: tableCellValues[1],
				omastav: tableCellValues[3],
				osastav: tableCellValues[5],
			},
		};
	}
}
