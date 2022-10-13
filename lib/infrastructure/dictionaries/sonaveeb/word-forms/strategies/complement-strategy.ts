import { ElementHandle, Page } from 'puppeteer';
import { WordFormStrategy } from '@lib/infrastructure/dictionaries/sonaveeb/word-forms';
import { ComplementForm } from '@lib/domain/dictionary-entry';

export default class ComplementStrategy implements WordFormStrategy {
	async getWordForms(page: Page, tableHandle: ElementHandle, partOfSpeech: string): Promise<ComplementForm | void> {
		if (partOfSpeech === 'täiendsõna') {
			return page.evaluate(this.evaluateComplementTable, tableHandle);
		}
	}

	private evaluateComplementTable(table: Element) {
		const tableCellElements = table.querySelectorAll('td');

		const tableCellValues = [...tableCellElements]
			.map((tableCell: Element) => tableCell?.textContent?.replace(/\s/g, '') ?? '')
			.filter((value) => value);

		return {
			muutumatu: tableCellValues[0],
		};
	}
}
