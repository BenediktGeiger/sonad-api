import { Query } from '@lib/shared/bus/query.interface';

// type wordClass = 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'conjunction' | 'interjection';

export class GetRandomFlashcardsQuery implements Query {
	_type = 'query';
	#amount: number;

	constructor(amount = 10) {
		this.#amount = amount;
	}

	get amount() {
		return this.#amount;
	}
}
