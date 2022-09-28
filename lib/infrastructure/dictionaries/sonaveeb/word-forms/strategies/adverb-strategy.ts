import { ElementHandle, Page } from 'puppeteer';
import { WordFormStrategy } from '@lib/infrastructure/dictionaries/sonaveeb/word-forms';
import { AdverbForm } from '@lib/domain/dictionary-entry';

export default class AdverbStrategy implements WordFormStrategy {
	async getWordForms(page: Page, tableHandle: ElementHandle, partOfSpeech: string): Promise<AdverbForm | void> {
		if (partOfSpeech !== 'määrsõna') {
			return;
		}

		return page.evaluate(this.evaluateAdverbTable, tableHandle);
	}

	private evaluateAdverbTable(table: Element) {
		const tableCellElements = table.querySelectorAll('td');

		const tableCellValues = [...tableCellElements]
			.map((tableCell: Element) => tableCell?.textContent?.replace(/\s/g, '') ?? '')
			.filter((value) => value);

		return {
			muutumatu: tableCellValues[0],
		};
	}
}
