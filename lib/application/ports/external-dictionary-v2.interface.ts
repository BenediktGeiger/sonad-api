export type DictionaryResponseV2 = {
	[key: string]: any;
}[];

export default interface ExternalDictionaryV2 {
	getDictionaryEntry(searchTerm: string): Promise<DictionaryResponseV2>;
}
