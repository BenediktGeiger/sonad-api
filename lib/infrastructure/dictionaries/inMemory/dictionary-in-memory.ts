import Dictionary from '@lib/domain/dictionary';
import { Response } from '@lib/domain/dictionary';
import { DictionaryEntry, Meaning, partOfSpeechesTag } from '@lib/domain/dictionary-entry';
import { right } from '@lib/common/either';

export default class DictionaryInMemory implements Dictionary {
	async getWord(word: string): Promise<Response> {
		const partOfSpeechesTags: Array<partOfSpeechesTag> = ['nimisõna'];
		const wordForms = ['wordform1', 'wordForm2'];
		const meanings: Array<Meaning> = [
			{
				definition: 'sldjfh',
				partofSpeech: 'slkdfj',
				synonyms: ['sldjfh'],
				examples: ['asdfjh'],
			},
		];

		const dictionaryEntry = new DictionaryEntry(word, partOfSpeechesTags, meanings, wordForms);

		return right(dictionaryEntry);
	}
}
