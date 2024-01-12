import { FlashcardSample } from '@lib/studies/domain/value-objects/flashcard-sample';

export class RandomFlashcardsGetDto {
	#amount: number;

	constructor(amount: number) {
		this.#amount = amount;
	}

	get amount() {
		return this.#amount;
	}
}

export class RandomFlashcardsGetResponseDto {
	#flashcards: FlashcardSample[];

	constructor(flashcards: FlashcardSample[]) {
		this.#flashcards = flashcards;
	}

	serialize() {
		return this.#flashcards.map((flashcard) => ({
			front: flashcard.front,
			back: flashcard.back,
		}));
	}
}
