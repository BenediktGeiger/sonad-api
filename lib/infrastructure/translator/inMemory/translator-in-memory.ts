import Translator from '@lib/application/ports/translator.interface';

interface InMemoryTranslationLookup {
	[key: string]: string;
}

const InMemoryTranslation: InMemoryTranslationLookup = {
	house: 'maja',
	cat: 'kass',
};

export default class TranslatorInMemory implements Translator {
	async translate(word: string): Promise<string | null> {
		return InMemoryTranslation[word] ?? '';
	}
	async getTranslations(term: string, from: string, to: string): Promise<string[]> {
		return [InMemoryTranslation[term]];
	}
}
