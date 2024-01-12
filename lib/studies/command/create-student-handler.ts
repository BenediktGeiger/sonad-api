import { CommandHandler } from '@lib/shared/bus/command-handler.interface';
import { CommandHandlerResponse } from '@lib/shared/bus/command-handler.interface';
import { StudentCreateCommand } from './create-student-command';
import StudiesRepository from '../application/ports/student-repository.interface';

export class StudentCreateHandler implements CommandHandler<StudentCreateCommand> {
	#studiesRepository: StudiesRepository;

	constructor(studiesRepository: StudiesRepository) {
		this.#studiesRepository = studiesRepository;
	}
	async execute(command: StudentCreateCommand): Promise<CommandHandlerResponse> {
		const randomNumber = Math.random();

		if (randomNumber < 0.5) {
			throw new Error('random network error');
		}

		const { id } = await this.#studiesRepository.createStudent(command.student);

		if (!id) {
			throw new Error('TODO');
		}

		return { success: true, id };
	}
}
