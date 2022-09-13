import Dictionary from '@lib/domain/dictionary';
import { Response } from '@lib/domain/dictionary';
import { DictionaryEntry, Meaning, partOfSpeechesTag } from '@lib/domain/dictionary-entry';
import LoggerInterface from '@lib/domain/logger/logger-interface';
import { right, left } from '@lib/common/either';
import { WordInvalidError } from '@lib/domain/errors/index';
import puppeteer from 'puppeteer';

const evaluateMeaning = (element: Element) => {
	const tagElement = element.querySelector('[class*="definition-row"] [class*="tag"]');

	const partofSpeech = tagElement?.textContent ?? '';

	const definitionElement = element.querySelector('[class*="definition-row"] [class*="definition-value"]');

	const definition = definitionElement?.textContent ?? '';

	const synonymsElements = element.querySelectorAll('[class*="synonyms"] [class="synonym"]');

	const synonyms = [...synonymsElements].map((element: Element) => element?.textContent?.trim() ?? '');

	const exampleElements = element.querySelectorAll('[class*="example-text-value"] ');

	const examples = [...exampleElements].map((element: Element) => element?.textContent?.trim() ?? '');

	const meaning: Meaning = {
		definition,
		partofSpeech,
		synonyms,
		examples,
	};

	return meaning;
};

const evaluateWordFormTable = (table: Element) => {
	const tableCellElements = table.querySelectorAll('td');

	const tableCellValues = [...tableCellElements]
		.map((tableCell: Element) => tableCell?.textContent?.replace(/\s/g, '') ?? '')
		.filter((value) => value);

	return tableCellValues;
};

const evaluatePartOfSpeechesTags = (element: Element) => {
	const partofSpeech = element.textContent as partOfSpeechesTag;

	return partofSpeech;
};

export default class DictonarySonaveeb implements Dictionary {
	private logger: LoggerInterface;

	constructor(logger: LoggerInterface) {
		this.logger = logger;
	}

	async getWord(word: string): Promise<Response> {
		try {
			const browser = await puppeteer.launch({
				devtools: true,
				headless: false,
				args: ['--disable-setuid-sandbox'],
				ignoreHTTPSErrors: true,
			});

			const page = await browser.newPage();

			await page.goto(`https://sonaveeb.ee/search/unif/est/eki/${word}/1`, { waitUntil: 'networkidle2' });

			const partOfSpeeches = await page.$$("[class*='tag my-1']");

			const partOfSpeechesTags = await Promise.all(
				partOfSpeeches.map((partOfSpeech) => page.evaluate(evaluatePartOfSpeechesTags, partOfSpeech))
			);

			const meaningType = "[id^='lexeme-section-']";
			const meaningSections = await page.$$(meaningType);

			const meanings = await Promise.all(
				meaningSections.map((meaning) => page.evaluate(evaluateMeaning, meaning))
			);

			const wordFormsTable = await page.$("[class*='morphology-paradigm'] table");

			let wordForms: Array<string> = [];
			if (wordFormsTable) {
				wordForms = await page.evaluate(evaluateWordFormTable, wordFormsTable);
			}

			const dictionaryEntry = new DictionaryEntry(word, partOfSpeechesTags, wordForms, meanings);
			await browser.close();
			return right(dictionaryEntry);
		} catch (err) {
			return left(WordInvalidError.create(word));
		}
	}
}
