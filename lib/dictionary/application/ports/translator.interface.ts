export default interface Translator {
	translate(word: string): Promise<string | null>;
	getTranslations(term: string, from: string, to: string): Promise<string[]>;
}
