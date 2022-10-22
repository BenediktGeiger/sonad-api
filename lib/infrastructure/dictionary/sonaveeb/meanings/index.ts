import { HTMLElement } from 'node-html-parser';
import { Meaning } from '@lib/domain/dictionary-entry';

const evaluateMeaning = (meaningElement: HTMLElement) => {
	const partofSpeech = meaningElement.querySelector('[class*="definition-row"] [class*="tag"]')?.textContent ?? '';

	const definition =
		meaningElement.querySelector('[class*="definition-row"] [class*="definition-value"]')?.textContent ?? '';

	const synonyms = meaningElement
		.querySelectorAll('[class*="synonyms"] [class="synonym"]')
		.map((element: HTMLElement) => element?.textContent?.trim() ?? '');

	const examples = meaningElement
		.querySelectorAll('[class*="example-text-value"] ')
		.map((element: HTMLElement) => element?.textContent?.trim() ?? '');

	const meaning: Meaning = {
		definition,
		partofSpeech,
		synonyms,
		examples,
	};

	return meaning;
};

export const parseMeanings = async (root: HTMLElement): Promise<Meaning[]> => {
	const meaningSections = root.querySelectorAll("[id^='lexeme-section-']");

	const meanings = await Promise.all(
		meaningSections.map((meaningElement: HTMLElement) => evaluateMeaning(meaningElement))
	);

	return meanings;
};
