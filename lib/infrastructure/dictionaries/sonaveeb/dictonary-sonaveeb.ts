import puppeteer, { Browser, Page } from 'puppeteer';
import Dictionary from '@lib/domain/dictionary';
import { Response } from '@lib/domain/dictionary';
import { DictionaryEntry } from '@lib/domain/dictionary-entry';
import LoggerInterface from '@lib/domain/logger/logger-interface';
import { right, left } from '@lib/common/either';
import { WordInvalidError } from '@lib/domain/errors/index';
import { IWordFormsFinder } from '@lib/infrastructure/dictionaries/sonaveeb/word-forms';
import { parseMeanings } from '@lib/infrastructure/dictionaries/sonaveeb/meanings';
import { parsePartOfSpeech } from '@lib/infrastructure/dictionaries/sonaveeb/part-of-speech';

export default class DictonarySonaveeb implements Dictionary {
	private logger: LoggerInterface;
	private wordFormsFinder: IWordFormsFinder;

	constructor(logger: LoggerInterface, wordFormsFinder: IWordFormsFinder) {
		this.logger = logger;
		this.wordFormsFinder = wordFormsFinder;
	}

	async getWord(word: string): Promise<Response> {
		try {
			const browser = await puppeteer.launch({
				devtools: true,
				headless: true,
				args: ['--disable-setuid-sandbox'],
				ignoreHTTPSErrors: true,
			});

			const page: Page = await browser.newPage();

			await page.goto(`https://sonaveeb.ee/search/unif/est/eki/${word}/1`, { waitUntil: 'networkidle2' });

			const partOfSpeechesTags = await parsePartOfSpeech(page);

			const meanings = await parseMeanings(page);

			const wordForms = await this.wordFormsFinder.findWordForms(partOfSpeechesTags[0], page);

			const dictionaryEntry = new DictionaryEntry(word, partOfSpeechesTags, meanings, wordForms);

			await browser.close();
			return right(dictionaryEntry);
		} catch (err) {
			return left(WordInvalidError.create(word));
		}
	}
}
