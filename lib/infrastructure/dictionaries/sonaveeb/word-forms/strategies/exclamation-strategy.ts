import { ElementHandle, Page } from 'puppeteer';
import { WordFormStrategy } from '@lib/infrastructure/dictionaries/sonaveeb/word-forms';
import { ExclamationForm } from '@lib/domain/dictionary-entry';

export default class ExclamationStrategy implements WordFormStrategy {
	async getWordForms(page: Page, tableHandle: ElementHandle, partOfSpeech: string): Promise<ExclamationForm | void> {
		if (partOfSpeech !== 'hüüdsõna') {
			return;
		}

		return page.evaluate(this.evaluateExclamationTable, tableHandle);
	}

	private evaluateExclamationTable(table: Element) {
		const tableCellElements = table.querySelectorAll('td');

		const tableCellValues = [...tableCellElements]
			.map((tableCell: Element) => tableCell?.textContent?.replace(/\s/g, '') ?? '')
			.filter((value) => value);

		return {
			muutumatu: tableCellValues[0],
		};
	}
}
