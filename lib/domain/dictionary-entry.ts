export type partOfSpeechesTag =
	| 'nimisõna'
	| 'tegusõna'
	| 'sidesõna'
	| 'määrsõna'
	| 'eessõna'
	| 'tagasõna'
	| 'täiendsõna';

export type Meaning = {
	definition: string;
	partofSpeech: string;
	synonyms: Array<string>;
	examples: Array<string>;
};

export type NounForm = {
	singular: {
		nimetav: string;
		omastav: string;
		osastav: string;
	};
	plural: {
		nimetav: string;
		omastav: string;
		osastav: string;
	};
};

export type AdjectiveForm = {
	singular: {
		nimetav: string;
		omastav: string;
		osastav: string;
	};
	plural: {
		nimetav: string;
		omastav: string;
		osastav: string;
	};
};

export type PronounForm = {
	singular: {
		nimetav: string;
		omastav: string;
		osastav: string;
	};
	plural: {
		nimetav: string;
		omastav: string;
		osastav: string;
	};
};

export type NumberWordForm = {
	singular: {
		nimetav: string;
		omastav: string;
		osastav: string;
	};
	plural: {
		nimetav: string;
		omastav: string;
		osastav: string;
	};
};

export type AdverbForm = {
	muutumatu: string;
};

export type ConjunctionForm = {
	muutumatu: string;
};

export type ExclamationForm = {
	muutumatu: string;
};

export type PrePostPositionForm = {
	muutumatu: string;
};

export type UnknownForm = {
	[key: string]: any;
};

export type VerbForm = {
	'ma-form': string;
	'da-form': string;
	'3-person-present-singular ': string;
	'3-person-past-singular': string;
	'nud-form': string;
	'tud-form': string;
	'impersonal-form-present': string;
	'imperative-2-person-singular': string;
};

export type WordForm =
	| NounForm
	| VerbForm
	| AdjectiveForm
	| AdverbForm
	| PronounForm
	| ConjunctionForm
	| ExclamationForm
	| PrePostPositionForm
	| NumberWordForm
	| UnknownForm;

export interface IDictionaryEntry {
	word: string;
	wordForms: WordForm;
	partOfSpeech: string[];
	meanings: Meaning[];
}

export class DictionaryEntry implements IDictionaryEntry {
	word: string;
	partOfSpeech: Array<partOfSpeechesTag>;
	meanings: Array<Meaning>;
	wordForms: WordForm;

	constructor(word: string, partOfSpeech: Array<partOfSpeechesTag>, meanings: Array<Meaning>, wordForms: WordForm) {
		this.word = word;
		this.partOfSpeech = partOfSpeech;
		this.wordForms = wordForms;
		this.meanings = meanings;
	}
}

export default IDictionaryEntry;
