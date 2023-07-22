// ts-ignore
import ExternalDictionaryV2, { DictionaryResponseV2 } from '@lib/application/ports/external-dictionary-v2.interface';
import LoggerInterface from '@lib/application/ports/logger.interface';

import { EkilexClient } from '@vanakaru/ekilex-api-client';

import { Forms, Lexeme, Paradigm } from '@vanakaru/ekilex-api-client/lib/src/resources/words';

type WordForm = {
	code: string;
	morphValue: string;
	value: string;
	inflectionType: string;
};

export default class DictonaryEkilex implements ExternalDictionaryV2 {
	private logger: LoggerInterface;
	private ekilexClient: EkilexClient;

	constructor(logger: LoggerInterface, ekilexClient: EkilexClient) {
		this.logger = logger;
		this.ekilexClient = ekilexClient;
	}

	private extractWordFormsFromParadigm(paradigm: Paradigm): WordForm[] {
		return paradigm.forms.reduce((acc: WordForm[], item: Forms) => {
			const existingItem = acc.find((form: WordForm) => form.code === item.morphCode);
			if (existingItem) {
				existingItem.value += ',' + item.value;
			} else {
				acc.push({
					inflectionType: paradigm.inflectionType,
					code: item.morphCode,
					morphValue: item.morphValue,
					value: item.value,
				});
			}
			return acc;
		}, []);
	}

	private extractFromLexeme(lexeme: Lexeme) {
		const definitions = lexeme.meaning.definitions.map((definition) => definition.value).join(',');

		const usages = lexeme.usages.map((usage) => usage.value);

		const synonymLangGroup = lexeme.synonymLangGroups.find((synonymLangGroup) => synonymLangGroup.lang === 'est');

		const synonyms = synonymLangGroup
			? synonymLangGroup.synonyms.map((synonym) => synonym.words.map((word) => word.wordValue).join(','))
			: [];

		return {
			definition: definitions,
			examples: usages,
			synonyms,
		};
	}

	async getDictionaryEntry(searchTerm: string): Promise<DictionaryResponseV2> {
		try {
			const searchResult = await this.ekilexClient.words.search(searchTerm, ['eki']);

			const wordIds = searchResult.words.map((word) => word.wordId);

			const promises = wordIds.map((wordId) => this.ekilexClient.words.getDetails(wordId));

			const wordDetails = await Promise.all(promises);

			const result = wordDetails.map((wordDetail) => {
				const wordClasses = [...new Set(wordDetail.paradigms.map((paradigm) => paradigm.wordClass))];

				const wordForms = wordDetail.paradigms.map(this.extractWordFormsFromParadigm).flat();

				const rest = wordDetail.lexemes
					.filter((lexeme) => lexeme.datasetCode === 'eki')
					.map(this.extractFromLexeme);

				return {
					wordClasses,
					wordForms,
					meanings: rest,
				};
			});

			return result;
		} catch (err) {
			this.logger.error({
				message: 'Unable to query ekilex',
				method: 'translate',
			});
			throw err;
		}
	}
}
