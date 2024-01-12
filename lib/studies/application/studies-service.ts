import { Bus } from '@lib/shared/bus/bus.interface';
import { CommandHandlerResponse } from '@lib/shared/bus/command-handler.interface';
import { QueryHandlerResponse } from '@lib/shared/bus/query-handler.interface';
import { Student } from '../domain/student';
import { Name } from '../domain/value-objects/name';
import { StudentCreateDto, StudentCreateDtoResponseDto } from './dtos/student-create.dto';
import { StudySetCreateDto, StudySetCreateResponseDto } from './dtos/study-set-create.dto';
import { StudentCreateCommand } from '../command/create-student-command';
import { GetStudentQuery } from '../query/get-student-query';
import { StudentGetDto, StudentGetResponseDto } from './dtos/student-get.dto';
import { FlashcardsCreateDto, FlashcardsCreateResponseDto } from './dtos/flashcards-create.dto';
import { FlashcardsCreateCommand } from '../command/flashcards-create-command';
import { StudySetCreateCommand } from '../command/create-study-set-command';
import { StudySet } from '../domain/study-set';
import { Flashcard } from '../domain/flashcard';
import { GetRandomFlashcardsQuery } from '../query/get-random-flashcard-query';
import { RandomFlashcardsGetDto, RandomFlashcardsGetResponseDto } from './dtos/random-flashcards-get.dto';
export default class StudiesService {
	private routingBus: Bus;

	constructor(routingBus: Bus) {
		this.routingBus = routingBus;
	}

	async createStudentAction(dto: StudentCreateDto): Promise<StudentCreateDtoResponseDto | null> {
		try {
			const studentName = Name.create(dto.firstname, dto.lastname);

			const student = new Student(studentName, []);

			const routingBusResponse = (await this.routingBus.execute(
				new StudentCreateCommand(student)
			)) as CommandHandlerResponse;

			const { success, id } = routingBusResponse;

			if (!success || !id) {
				return null;
			}

			return new StudentCreateDtoResponseDto(routingBusResponse.id);
		} catch (error) {
			throw new Error('invalid student name');
		}
	}

	async getStudentQuery(dto: StudentGetDto): Promise<StudentGetResponseDto | null> {
		const routingBusResponse = (await this.routingBus.execute(new GetStudentQuery(dto.id))) as QueryHandlerResponse;
		const { payload, success } = routingBusResponse;

		if (!success || !payload) {
			return null;
		}

		return new StudentGetResponseDto(payload);
	}

	async addStudySetAction(dto: StudySetCreateDto): Promise<StudySetCreateResponseDto | null> {
		const studySet = new StudySet(dto.studentId, dto.title, dto.description, []);

		const routingBusResponse = (await this.routingBus.execute(
			new StudySetCreateCommand(studySet)
		)) as CommandHandlerResponse;

		const { id, success } = routingBusResponse;

		if (!success || !id) {
			return null;
		}

		return new StudySetCreateResponseDto(id);
	}

	async addFlashCardsAction(dto: FlashcardsCreateDto): Promise<FlashcardsCreateResponseDto | null> {
		const flashcards = dto.flashcards.map((flashcard) => {
			return new Flashcard({
				studySetId: dto.studySetId,
				front: flashcard.front,
				back: flashcard.back,
			});
		});

		const routingBusResponse = (await this.routingBus.execute(
			new FlashcardsCreateCommand(dto.studentId, dto.studySetId, flashcards)
		)) as CommandHandlerResponse;

		const { id, success } = routingBusResponse;

		if (!success || !id) {
			return null;
		}

		return new FlashcardsCreateResponseDto(id);
	}

	async getRandomFlashcardsQuery(dto: RandomFlashcardsGetDto): Promise<RandomFlashcardsGetResponseDto | null> {
		const routingBusResponse = (await this.routingBus.execute(
			new GetRandomFlashcardsQuery(dto.amount ?? 10)
		)) as QueryHandlerResponse;
		const { payload, success } = routingBusResponse;

		if (!success || !payload) {
			return null;
		}

		return new RandomFlashcardsGetResponseDto(payload);
	}
}
