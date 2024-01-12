import { UUID } from 'crypto';
import { FlashcardsCreateDto } from './flashcards-create.dto';

export class StudySetCreateDto {
	#studentId: UUID;
	#title: string;
	#description: string | '';
	#flashcards?: FlashcardsCreateDto;

	constructor(studentId: UUID, title: string, description: string, flashcards?: FlashcardsCreateDto) {
		this.#studentId = studentId;
		this.#title = title;
		this.#description = description;
		this.#flashcards = flashcards;
	}

	get studentId() {
		return this.#studentId;
	}

	get title() {
		return this.#title;
	}

	get description() {
		return this.#description;
	}

	get flashcards() {
		return this.#flashcards;
	}
}

export class StudySetCreateResponseDto {
	#id: UUID;

	constructor(id: UUID) {
		this.#id = id;
	}

	get id() {
		return this.#id;
	}
}
