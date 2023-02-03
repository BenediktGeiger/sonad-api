export default interface Translator {
	translate(word: string): Promise<string | null>;
}
