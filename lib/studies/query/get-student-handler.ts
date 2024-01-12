import { QueryHandler, QueryHandlerResponse } from '@lib/shared/bus/query-handler.interface';
import StudiesRepository from '../application/ports/student-repository.interface';
import { GetStudentQuery } from './get-student-query';

export class GetStudentQueryHandler implements QueryHandler<GetStudentQuery> {
	#studiesRepository: StudiesRepository;

	constructor(studiesRepository: StudiesRepository) {
		this.#studiesRepository = studiesRepository;
	}
	async execute(query: GetStudentQuery): Promise<QueryHandlerResponse> {
		const student = await this.#studiesRepository.getStudent(query.id);

		if (!student) {
			return {
				success: false,
				payload: null,
			};
		}

		return {
			success: true,
			payload: student,
		};
	}
}
