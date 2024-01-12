import { QueryHandler, QueryHandlerResponse } from '@lib/shared/bus/query-handler.interface';
import StudiesRepository from '../application/ports/student-repository.interface';
import { GetRandomFlashcardsQuery } from './get-random-flashcard-query';

export class GetRandomFlashcardQueryHandler implements QueryHandler<GetRandomFlashcardsQuery> {
	#studiesRepository: StudiesRepository;

	constructor(studiesRepository: StudiesRepository) {
		this.#studiesRepository = studiesRepository;
	}
	async execute(query: GetRandomFlashcardsQuery): Promise<QueryHandlerResponse> {
		const randomFlashcards = await this.#studiesRepository.getRandomFlashcards(query.amount);

		if (!randomFlashcards) {
			return {
				success: false,
				payload: null,
			};
		}

		return {
			success: true,
			payload: randomFlashcards,
		};
	}
}
