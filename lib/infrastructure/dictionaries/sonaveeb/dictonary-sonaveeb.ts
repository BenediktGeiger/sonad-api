import Dictionary from '@lib/domain/dictionary';
import { DictionaryResponse } from '@lib/domain/dictionary';
import { DictionaryEntry } from '@lib/domain/dictionary-entry';
import LoggerInterface from '@lib/domain/logger/logger-interface';
import { right, left } from '@lib/common/either';
import { asyncStopWatch } from '@lib/common/stop-watch';
import WordFormsFinder from '@lib/infrastructure/dictionaries/sonaveeb/word-forms';
import { parseMeanings } from '@lib/infrastructure/dictionaries/sonaveeb/meanings';
import { parsePartOfSpeech } from '@lib/infrastructure/dictionaries/sonaveeb/part-of-speech';
import { Browser } from 'puppeteer';

export default class DictonarySonaveeb implements Dictionary {
	private logger: LoggerInterface;
	private wordFormsFinder: WordFormsFinder;
	private browser: Browser;

	constructor(logger: LoggerInterface, wordFormsFinder: WordFormsFinder, browser: Browser) {
		this.logger = logger;
		this.wordFormsFinder = wordFormsFinder;
		this.browser = browser;
	}

	async getWord(word: string): Promise<DictionaryResponse> {
		try {
			const page = await this.browser.newPage();

			await page.setRequestInterception(true);

			page.on('request', (req) => {
				if (
					req.resourceType() == 'stylesheet' ||
					req.resourceType() == 'font' ||
					req.resourceType() == 'image'
				) {
					req.abort();
				} else {
					req.continue();
				}
			});

			await asyncStopWatch(page.goto.bind(page), this.logger)(
				`https://sonaveeb.ee/search/unif/est/eki/${word}/1`,
				{
					waitUntil: 'networkidle2',
				}
			);

			const partOfSpeechesTags = await asyncStopWatch(parsePartOfSpeech, this.logger)(page);

			if (!partOfSpeechesTags.length) {
				const dictionaryEntry = new DictionaryEntry(word, [], [], []);
				await page.close();
				return right(dictionaryEntry);
			}

			const meanings = await asyncStopWatch(parseMeanings, this.logger)(page);

			const wordForms = await asyncStopWatch(
				this.wordFormsFinder.findWordForms.bind(this.wordFormsFinder),
				this.logger
			)(partOfSpeechesTags[0], page);

			const dictionaryEntry = new DictionaryEntry(word, partOfSpeechesTags, meanings, wordForms);

			await page.close();

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
}
