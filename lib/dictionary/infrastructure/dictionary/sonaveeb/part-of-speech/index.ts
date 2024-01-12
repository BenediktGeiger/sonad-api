import { HTMLElement } from 'node-html-parser';
import { partOfSpeechesTag } from '@lib/dictionary/domain/dictionary-entry';

export const parsePartOfSpeech = async (root: HTMLElement): Promise<partOfSpeechesTag[]> => {
	return root
		.querySelectorAll("[class*='tag my-1']")
		.map((element: HTMLElement) => element.textContent as partOfSpeechesTag);
};
