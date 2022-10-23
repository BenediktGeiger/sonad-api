export default interface DictionaryCache {
	get(key: string): Promise<string | null>;
	set(key: string, value: string, ttlInSeconds?: number): void;
}
