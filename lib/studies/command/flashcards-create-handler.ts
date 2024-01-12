import { CommandHandler } from '@lib/shared/bus/command-handler.interface';
import { FlashcardsCreateCommand } from './flashcards-create-command';
import { CommandHandlerResponse } from '@lib/shared/bus/command-handler.interface';
import StudiesRepository from '../application/ports/student-repository.interface';

export class FlashcardsCreateHandler implements CommandHandler<FlashcardsCreateCommand> {
	private studiesRepository: StudiesRepository;

	constructor(studiesRepository: StudiesRepository) {
		this.studiesRepository = studiesRepository;
	}
	async execute(command: FlashcardsCreateCommand): Promise<CommandHandlerResponse> {
		const student = await this.studiesRepository.getStudent(command.studentId);

		if (!student) {
			throw new Error('student not found');
		}

		student.addFlashcards(command.studySetId, command.flashcards);

		const { id } = await this.studiesRepository.saveStudent(student);

		return { success: true, id: id };
	}
}
