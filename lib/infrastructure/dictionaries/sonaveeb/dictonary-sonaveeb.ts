/* eslint-disable no-underscore-dangle */
import Dictionary from '@lib/domain/dictionary';
import { Response } from '@lib/domain/dictionary';
import { caseQuestions, CaseNames, caseKeys } from '@lib/domain/constants';
import { DictionaryEntry } from '@lib/domain/dictionary-entry';
import LoggerInterface from '@lib/domain/logger/logger-interface';
import { right, left } from '@lib/common/either';
import { UnexpectedDomainError, WordInvalidError } from '@lib/domain/errors/index';

export default class DictonarySonaveeb implements Dictionary {
	private apiClient;
	private htmlParser;
	private logger: LoggerInterface;

	constructor(apiClient: any, htmlParser: any, logger: LoggerInterface) {
		this.apiClient = apiClient;
		this.htmlParser = htmlParser;
		this.logger = logger;
	}

	async getWordCases(word: string): Promise<Response> {
		try {
			const result = await this.apiClient.getWordIdHtml({ word });

			if (result.isFailure) {
				this.logger.error({
					message: `word ID HTML not found: ${JSON.stringify(result)}`,
					method: 'getWordCases',
				});
				return result;
			}

			const wordIdResult = await this.htmlParser.getWordId({ rawHtml: await result.getValue() });

			if (wordIdResult.isFailure) {
				this.logger.error({
					message: `Word ID not found during parsing: ${JSON.stringify(wordIdResult)}`,
					method: 'getWordCases',
				});
				return left(WordInvalidError.create(word));
			}

			const wordDetailsPageResult = await this.apiClient.getWordDetailsHtml({ wordId: wordIdResult.getValue() });

			if (wordDetailsPageResult.isFailure) {
				this.logger.error({
					message: `word details HTML not found: ${JSON.stringify(wordDetailsPageResult)}`,
					method: 'getWordCases',
				});
				return wordDetailsPageResult;
			}

			const paradigmIdResult = await this.htmlParser.getParadimId({
				rawHtml: await wordDetailsPageResult.getValue(),
			});

			if (paradigmIdResult.isFailure) {
				this.logger.error({
					message: `paradigm ID not found during parsing: ${JSON.stringify(paradigmIdResult)}`,
					method: 'getWordCases',
				});
				return paradigmIdResult;
			}

			const tabelPageResult = await this.apiClient.getTableHtml({ paradigmId: paradigmIdResult.getValue() });

			if (tabelPageResult.isFailure) {
				this.logger.error({
					message: `word table HTML not found: ${JSON.stringify(tabelPageResult)}`,
					method: 'getWordCases',
				});
				return tabelPageResult;
			}

			const sonaVeebCases = await this.htmlParser.parseWordCases({ rawHtml: tabelPageResult.getValue() });

			const dictionaryEntry = new DictionaryEntry(word);

			// Continue here
			// https://khalilstemmler.com/articles/enterprise-typescript-nodejs/functional-error-handling/

			// define Error Responses AND success Responses

			sonaVeebCases.map((sonaCase: { caseName: string; singular: string; plural: string }) => {
				const caseData = {
					name: CaseNames[sonaCase.caseName as caseKeys],
					question: caseQuestions[sonaCase.caseName as caseKeys],
					singular: sonaCase.singular,
					plural: sonaCase.plural,
				};
				dictionaryEntry.addCase(caseData);
			});

			this.logger.info({
				message: `case parsing successfull for ${word}`,
				method: 'getWordCases',
			});

			return right(dictionaryEntry);
		} catch (err) {
			return left(UnexpectedDomainError.create(err));
		}
	}
}
