import { ElementHandle, Page } from 'puppeteer';
import { WordFormStrategy } from '@lib/infrastructure/dictionaries/sonaveeb/word-forms';
import { NounForm } from '@lib/domain/dictionary-entry';

export default class NounStrategy implements WordFormStrategy {
	async getWordForms(page: Page, tableHandle: ElementHandle, partOfSpeech: string): Promise<NounForm | void> {
		if (partOfSpeech !== 'nimisõna') {
			return;
		}

		return page.evaluate(this.evaluateNounTable, tableHandle);
	}

	private evaluateNounTable(table: Element) {
		const tableCellElements = table.querySelectorAll('td');

		const tableCellValues = [...tableCellElements]
			.map((tableCell: Element) => tableCell?.textContent?.replace(/\s/g, '') ?? '')
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
