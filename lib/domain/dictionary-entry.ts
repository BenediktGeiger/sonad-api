import { CaseNames, caseQuestions } from '@lib/domain/constants';

interface CaseInfo {
	name: CaseNames;
	question: caseQuestions;
	singular: string;
	plural: string;
}

export type partOfSpeechesTag =
	| 'nimisõna'
	| 'tegusõna'
	| 'sidesõna'
	| 'määrsõna'
	| 'eessõna'
	| 'tagasõna'
	| 'täiendsõna';

export interface Meaning {
	definition: string;
	partofSpeech: string;
	synonyms: Array<string>;
	examples: Array<string>;
}

export interface IDictionaryEntry {
	word: string;
	wordForms: object;
	partOfSpeech: string[];
	meanings: Meaning[];
}

export class DictionaryEntry implements IDictionaryEntry {
	word: string;
	partOfSpeech: Array<partOfSpeechesTag>;
	meanings: Array<Meaning>;
	wordForms: object; // make discrimanted union out of it

	constructor(word: string, partOfSpeech: Array<partOfSpeechesTag>, meanings: Array<Meaning>, wordForms: object) {
		this.word = word;
		this.partOfSpeech = partOfSpeech;
		this.wordForms = wordForms;
		this.meanings = meanings;
	}
}

export default IDictionaryEntry;
