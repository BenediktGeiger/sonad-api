import Dictionary from '@lib/domain/dictionary';
import DictionaryCache from '@lib/domain/cache-repository';
import { WordInvalidError, UnexpectedDomainError } from '@lib/domain/errors/index';
import { Either, right, left } from '@lib/common/either';
import { Response } from '@lib/domain/dictionary';
import { Result } from '@lib/common/result';
import DictionaryEntry from '@lib/domain/dictionary-entry';
import Logger from '@lib/domain/logger/logger-interface';

type UseCaseResponse = Either<WordInvalidError | UnexpectedDomainError, GetWordResult>;

class GetWordResult extends Result<DictionaryEntry> {
	public constructor(value: DictionaryEntry) {
		super(true, null, value);
	}

	public static create(value: DictionaryEntry): GetWordResult {
		return new GetWordResult(value);
	}
}

export default class DictionaryService {
	private dictionary: Dictionary;
	private cacheRepository: DictionaryCache;
	private logger: Logger;
	constructor({
		dictionary,
		cacheRepository,
		logger,
	}: {
		dictionary: Dictionary;
		cacheRepository: DictionaryCache;
		logger: Logger;
	}) {
		this.dictionary = dictionary;
		this.cacheRepository = cacheRepository;
		this.logger = logger;
	}

	async getWord(word: string): Promise<UseCaseResponse> {
		if (!word) {
			return left(WordInvalidError.create(word));
		}

		const cachedDictionaryEntry = process.env.CACHE ? await this.cacheRepository.get(word) : null;

		if (cachedDictionaryEntry) {
			this.logger.info({
				message: `found cases in cache for ${word}`,
				method: 'getCases',
			});
			const entry: DictionaryEntry = JSON.parse(cachedDictionaryEntry);
			return right(GetWordResult.create(entry));
		}

		const result: Response = await this.dictionary.getWord(word);

		if (result.isLeft()) {
			return left(result.value);
		}

		await this.cacheRepository.set(word, JSON.stringify(result.value));

		return right(GetWordResult.create(result.value));
	}
}
