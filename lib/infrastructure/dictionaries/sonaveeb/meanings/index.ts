import { Page } from 'puppeteer';
import { Meaning } from '@lib/domain/dictionary-entry';

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

export const parseMeanings = async (page: Page): Promise<Meaning[]> => {
	const meaningType = "[id^='lexeme-section-']";
	const meaningSections = await page.$$(meaningType);

	const meanings = await Promise.all(meaningSections.map((meaning) => page.evaluate(evaluateMeaning, meaning)));

	return meanings;
};
