import { HTMLElement } from 'node-html-parser';
import { WordFormStrategy } from '@lib/infrastructure/dictionaries/sonaveeb/word-forms';
import { VerbForm } from '@lib/domain/dictionary-entry';

export default class VerbStrategy implements WordFormStrategy {
	async getWordForms(tableElement: HTMLElement, partOfSpeech: string): Promise<VerbForm | void> {
		if (partOfSpeech !== 'tegusõna') {
			return;
		}

		return this.evaluateVerbTable(tableElement);
	}

	private evaluateVerbTable(table: HTMLElement) {
		const tableCellElements = table.querySelectorAll('td');

		const tableCellValues = [...tableCellElements]
			.map((tableCell: HTMLElement) => tableCell?.textContent?.replace(/\s/g, '') ?? '')
			.filter((value) => value);

		return {
			'ma-form': tableCellValues[0],
			'da-form': tableCellValues[2],
			'3-person-present-singular': tableCellValues[4],
			'3-person-past-singular': tableCellValues[1],
			'nud-form': tableCellValues[3],
			'tud-form': tableCellValues[6],
			'impersonal-form-present': tableCellValues[7],
			'imperative-2-person-singular': tableCellValues[5],
		};
	}
}
