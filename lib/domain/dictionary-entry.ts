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

interface IDictionaryEntry {
	word: string;
	meanings: Array<Meaning>;
	cases: Array<CaseInfo>; // rename to wordForms
}

export class DictionaryEntry implements IDictionaryEntry {
	word: string;
	partOfSpeech: Array<partOfSpeechesTag>;
	wordForms: Array<string>; // make discrimanted union out of it
	meanings: Array<Meaning>;
	cases: Array<CaseInfo>;

	constructor(
		word: string,
		partOfSpeech: Array<partOfSpeechesTag>,
		wordForms: Array<string>,
		meanings: Array<Meaning>
	) {
		this.word = word;
		this.partOfSpeech = partOfSpeech;
		this.wordForms = wordForms;
		this.meanings = meanings;
		this.cases = [];
	}

	addCase(caseData: CaseInfo) {
		this.cases.push(caseData);
	}
}

export default IDictionaryEntry;
