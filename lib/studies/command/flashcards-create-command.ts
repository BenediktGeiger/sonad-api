import { Command } from '@lib/shared/bus/command.interface';
import { UUID } from 'crypto';
import { Flashcard } from '../domain/flashcard';

export class FlashcardsCreateCommand implements Command {
	_type = 'command';
	#studentId: UUID;
	#studySetId: UUID;
	#flashcards: Flashcard[];

	constructor(studentId: UUID, studySetId: UUID, flashcards: Flashcard[]) {
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
