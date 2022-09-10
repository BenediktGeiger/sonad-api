import { CaseNames, caseQuestions } from '@lib/domain/constants';

interface CaseInfo {
	name: CaseNames;
	question: caseQuestions;
	singular: string;
	plural: string;
}

interface IDictionaryEntry {
	word: string;
	cases: Array<CaseInfo>;
}

export class DictionaryEntry implements IDictionaryEntry {
	word: string;
	cases: Array<CaseInfo>;

	constructor(word: string) {
		this.word = word;
		this.cases = [];
	}

	addCase(caseData: CaseInfo) {
		this.cases.push(caseData);
	}
}

export default IDictionaryEntry;
