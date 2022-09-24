import { ElementHandle, Page } from 'puppeteer';
import { WordFormStrategy } from '@lib/infrastructure/dictionaries/sonaveeb/word-forms';

export default class VerbStrategy implements WordFormStrategy {
	async getWordForms(page: Page, tableHandle: ElementHandle, partOfSpeech: string): Promise<object | void> {
		if (partOfSpeech !== 'tegusõna') {
			return;
		}

		return page.evaluate(this.evaluateVerbTable, tableHandle);
	}

	private evaluateVerbTable(table: Element) {
		const tableCellElements = table.querySelectorAll('td');

		const tableCellValues = [...tableCellElements]
			.map((tableCell: Element) => tableCell?.textContent?.replace(/\s/g, '') ?? '')
			.filter((value) => value);

		return {
			'ma-tegevusnimi': tableCellValues[0],
			'da-tegevusnimi': tableCellValues[2],
			'oleviku-ainsuse-3-pöörde ': tableCellValues[4],
			'lihtmineviku-ainsuse-3-pöörde': tableCellValues[1],
			'nud-kesksõna': tableCellValues[3],
			'tud-kesksõna': tableCellValues[6],
			'oleviku-umbisikuline-tegumood': tableCellValues[7],
			'käskiva-kõneviisi-oleviku-ainsuse-2-pöörde': tableCellValues[5],
		};
	}
}
