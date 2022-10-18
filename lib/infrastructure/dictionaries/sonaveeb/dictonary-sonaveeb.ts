import Dictionary from '@lib/domain/dictionary';
import { DictionaryResponse } from '@lib/domain/dictionary';
import { DictionaryEntry } from '@lib/domain/dictionary-entry';
import LoggerInterface from '@lib/domain/logger/logger-interface';
import { right, left } from '@lib/common/either';
import { asyncStopWatch } from '@lib/common/stop-watch';
import WordFormsFinder from '@lib/infrastructure/dictionaries/sonaveeb/word-forms';
import { parseMeanings } from '@lib/infrastructure/dictionaries/sonaveeb/meanings';
import { parsePartOfSpeech } from '@lib/infrastructure/dictionaries/sonaveeb/part-of-speech';
import { parse } from 'node-html-parser';

import SonaVeebClient from '@lib/infrastructure/dictionaries/sonaveeb/api-client';

export default class DictonarySonaveeb implements Dictionary {
	private logger: LoggerInterface;
	private wordFormsFinder: WordFormsFinder;
	private sonaveebClient: SonaVeebClient;

	constructor(logger: LoggerInterface, wordFormsFinder: WordFormsFinder, sonaveebClient: SonaVeebClient) {
		this.logger = logger;
		this.wordFormsFinder = wordFormsFinder;
		this.sonaveebClient = sonaveebClient;
	}

	async getWord(word: string): Promise<DictionaryResponse> {
		try {
			const resultHtml = await this.sonaveebClient.getResultPage(word);

			const wordId = await this.getWordId(resultHtml);

			if (!wordId) {
				const dictionaryEntry = new DictionaryEntry(word, [], [], []);

				return right(dictionaryEntry);
			}

			const detailsHtml = await this.sonaveebClient.getWordDetailsHtml(String(wordId));

			const rootElement = parse(detailsHtml);

			const partOfSpeechesTags = await asyncStopWatch(parsePartOfSpeech, this.logger)(rootElement);

			const meanings = await asyncStopWatch(parseMeanings, this.logger)(rootElement);

			const wordForms = await asyncStopWatch(
				this.wordFormsFinder.findWordForms.bind(this.wordFormsFinder),
				this.logger
			)(partOfSpeechesTags[0], rootElement);

			const dictionaryEntry = new DictionaryEntry(word, partOfSpeechesTags, meanings, wordForms);

			return right(dictionaryEntry);
		} catch (err) {
			console.log(err);
			this.logger.error({
				message: JSON.stringify(err),
				method: 'getWord',
			});
			return left({
				message: 'An unexpected error occurred',
				error: err,
			});
		}
	}

	private async getWordId(rawHtml: string) {
		const root = parse(rawHtml);

		const wordId = root.querySelector('[name=word-id]');

		return wordId?.getAttribute('value') ?? null;
	}
}
