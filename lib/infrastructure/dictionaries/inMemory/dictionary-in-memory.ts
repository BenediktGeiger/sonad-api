/* eslint-disable no-underscore-dangle */
import Dictionary from '@lib/domain/dictionary';
import { Response } from '@lib/domain/dictionary';
import { caseQuestions, CaseNames } from '@lib/domain/constants';
import { DictionaryEntry } from '@lib/domain/dictionary-entry';
import { right } from '@lib/common/either';

export default class DictionaryInMemory implements Dictionary {
	async getWordCases(word: string): Promise<Response> {
		const dictionaryEntry = new DictionaryEntry(word);

		const caseData1 = {
			name: CaseNames.NIMETAV,
			question: caseQuestions.NIMETAV,
			singular: 'maja',
			plural: 'majad',
		};

		dictionaryEntry.addCase(caseData1);

		return right(dictionaryEntry);
	}
}
