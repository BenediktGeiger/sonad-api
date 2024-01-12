import { Student } from '@lib/studies/domain/student';
import { UUID } from 'crypto';

export class StudentGetDto {
	#id: UUID;

	constructor(id: UUID) {
		this.#id = id;
	}

	get id() {
		return this.#id;
	}
}

export class StudentGetResponseDto {
	#student: Student;

	constructor(student: Student) {
		this.#student = student;
	}

	serialize() {
		return {
			firstname: this.#student.firstname,
			lastname: this.#student.lastname,
			studySets: this.#student.studySets.map((studySet) => ({
				id: studySet.id,
				title: studySet.title,
				description: studySet.description,
				flashcards: studySet.flashcards.map((flashcard) => ({
					front: flashcard.front,
					back: flashcard.back,
				})),
			})),
		};
	}
}
