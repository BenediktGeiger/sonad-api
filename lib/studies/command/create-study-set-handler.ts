import { CommandHandler } from '@lib/shared/bus/command-handler.interface';
import { CommandHandlerResponse } from '@lib/shared/bus/command-handler.interface';
import StudiesRepository from '../application/ports/student-repository.interface';
import { StudySetCreateCommand } from './create-study-set-command';
import { randomUUID } from 'crypto';

export class StudySetCreateHandler implements CommandHandler<StudySetCreateCommand> {
	#studiesRepository: StudiesRepository;

	constructor(studiesRepository: StudiesRepository) {
		this.#studiesRepository = studiesRepository;
	}
	async execute(command: StudySetCreateCommand): Promise<CommandHandlerResponse> {
		const randomNumber = Math.random();

		// if (randomNumber < 0.5) {
		// 	console.log('random network error');
		// 	throw new Error('random network error');
		// }

		const student = await this.#studiesRepository.getStudent(command.studySet.studentId);

		if (!student) {
			throw new Error('No student found');
		}

		student.addStudySet(command.studySet);

		const { id } = await this.#studiesRepository.saveStudent(student);

		return { success: true, id: command.studySet.id };
	}
}
