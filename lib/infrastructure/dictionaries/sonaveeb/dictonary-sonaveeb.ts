import puppeteer, { Page } from 'puppeteer';
import Dictionary from '@lib/domain/dictionary';
import { Response } from '@lib/domain/dictionary';
import { DictionaryEntry } from '@lib/domain/dictionary-entry';
import LoggerInterface from '@lib/domain/logger/logger-interface';
import { right, left } from '@lib/common/either';
import { asyncStopWatch } from '@lib/common/stop-watch';
import { WordInvalidError } from '@lib/domain/errors/index';
import WordFormsFinder from '@lib/infrastructure/dictionaries/sonaveeb/word-forms';
import { parseMeanings } from '@lib/infrastructure/dictionaries/sonaveeb/meanings';
import { parsePartOfSpeech } from '@lib/infrastructure/dictionaries/sonaveeb/part-of-speech';

export default class DictonarySonaveeb implements Dictionary {
	private logger: LoggerInterface;
	private wordFormsFinder: WordFormsFinder;

	constructor(logger: LoggerInterface, wordFormsFinder: WordFormsFinder) {
		this.logger = logger;
		this.wordFormsFinder = wordFormsFinder;
	}

	async getWord(word: string): Promise<Response> {
		try {
			const browser = await asyncStopWatch(
				puppeteer.launch,
				this.logger
			)({
				devtools: true,
				headless: true,
				args: ['--disable-setuid-sandbox'],
				ignoreHTTPSErrors: true,
			});

			const page: Page = await asyncStopWatch(browser.newPage.bind(browser), this.logger)();

			await page.setRequestInterception(true);
			page.on('request', (req) => {
				if (req.resourceType() === 'image') {
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
				return left(WordInvalidError.create(word));
			}

			const meanings = await asyncStopWatch(parseMeanings, this.logger)(page);

			const wordForms = await asyncStopWatch(
				this.wordFormsFinder.findWordForms.bind(this.wordFormsFinder),
				this.logger
			)(partOfSpeechesTags[0], page);

			const dictionaryEntry = new DictionaryEntry(word, partOfSpeechesTags, meanings, wordForms);

			await asyncStopWatch(browser.close.bind(browser), this.logger)();

			return right(dictionaryEntry);
		} catch (err) {
			return left(WordInvalidError.create(word));
		}
	}
}
