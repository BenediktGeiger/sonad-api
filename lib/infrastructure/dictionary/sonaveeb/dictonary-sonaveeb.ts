import ExternalDictionary from '@lib/application/ports/external-dictionary.interface';
import { DictionaryResponse } from '@lib/application/ports/external-dictionary.interface';
import { DictionaryEntry } from '@lib/domain/dictionary-entry';
import LoggerInterface from '@lib/application/ports/logger.interface';
import { right, left } from '@lib/shared/common/either';
import { asyncStopWatch } from '@lib/shared/common/stop-watch';
import WordFormsFinder from '@lib/infrastructure/dictionary/sonaveeb/word-forms';
import { parseMeanings } from '@lib/infrastructure/dictionary/sonaveeb/meanings';
import { parsePartOfSpeech } from '@lib/infrastructure/dictionary/sonaveeb/part-of-speech';
import { parse } from 'node-html-parser';

import SonaVeebClient from '@lib/infrastructure/dictionary/sonaveeb/api-client';

export default class DictonarySonaveeb implements ExternalDictionary {
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
			const wordId = await this.getWordId(word);

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

	private async getWordId(word: string) {
		const resultHtml = await this.sonaveebClient.getResultPage(word);
		const root = parse(resultHtml);

		const wordId = root.querySelector('[name=word-id]');

		if (wordId) {
			return wordId.getAttribute('value') ?? null;
		}

		const otherForm = root.querySelector('[id=form-words] [data-word]');

		if (!otherForm) {
			return null;
		}

		const newWord = otherForm.textContent;

		const resultHtmlNew = await this.sonaveebClient.getResultPage(newWord);

		const rootNew = parse(resultHtmlNew);

		const wordIdNew = rootNew.querySelector('[name=word-id]');

		return wordIdNew?.getAttribute('value') ?? null;
	}
}
