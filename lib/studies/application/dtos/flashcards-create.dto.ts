import { UUID } from 'crypto';

export class FlashcardsCreateDto {
	#studentId: UUID;
	#studySetId: UUID;
	#flashcards: {
		front: string;
		back: string;
	}[];

	constructor(
		studentId: UUID,
		studySetId: UUID,
		flashcards: {
			front: string;
			back: string;
		}[]
	) {
		this.#studentId = studentId;
		this.#studySetId = studySetId;
		this.#flashcards = flashcards;
	}

	get studentId() {
		return this.#studentId;
	}

	get studySetId() {
		return this.#studySetId;
	}

	get flashcards() {
		return this.#flashcards;
	}
}

export class FlashcardsCreateResponseDto {
	#id: UUID;

	constructor(id: UUID) {
		this.#id = id;
	}

	get id() {
		return this.#id;
	}
}
