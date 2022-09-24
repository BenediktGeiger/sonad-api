import { Page } from 'puppeteer';
import { partOfSpeechesTag } from '@lib/domain/dictionary-entry';

const evaluatePartOfSpeechesTags = (element: Element) => {
	const partofSpeech = element.textContent as partOfSpeechesTag;

	return partofSpeech;
};

export const parsePartOfSpeech = async (page: Page): Promise<partOfSpeechesTag[]> => {
	const partOfSpeeches = await page.$$("[class*='tag my-1']");

	const partOfSpeechesTags = await Promise.all(
		partOfSpeeches.map((partOfSpeech) => page.evaluate(evaluatePartOfSpeechesTags, partOfSpeech))
	);

	return partOfSpeechesTags;
};
