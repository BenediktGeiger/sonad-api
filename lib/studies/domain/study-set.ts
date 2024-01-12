import { UUID } from 'crypto';
import { Flashcard } from './flashcard';

import { Entity } from '@lib/shared/domain/entity';

export interface StudySetProps {
	studentId: UUID;
	title: string;
	description: string;
	flashcards: Flashcard[];
	id?: UUID;
}

export class StudySet extends Entity<StudySetProps> {
	constructor(studentId: UUID, title: string, description: string, flashcards: Flashcard[], id?: UUID) {
		// TODO validate correct studyset props!!!

		super({ studentId, title, description, flashcards }, id);
	}

	toJSON() {
		return {
			id: this.id,
			title: this.title,
			description: this.description,
			flashcards: this.flashcards.map((flashcard) => flashcard.toJSON()),
		};
	}

	static fromJSON({
		id,
		title,
		description,
		flashcards,
		studentId,
	}: {
		id: UUID;
		title: string;
		description: string;
		flashcards: {
			front: string;
			back: string;
		}[];
		studentId: UUID;
	}): StudySet {
		return new StudySet(
			studentId,
			title,
			description,
			flashcards.map((flashcard) =>
				Flashcard.fromJSON({
					...flashcard,
					studySetId: id,
				})
			),
			id
		);
	}

	get title(): string {
		return this.props.title;
	}

	get description(): string {
		return this.props.description ?? '';
	}

	get flashcards(): Flashcard[] {
		return this.props.flashcards;
	}

	get studentId(): UUID {
		return this.props.studentId;
	}

	addFlashcards(flashcards: Flashcard[]) {
		this.props.flashcards = [...this.props.flashcards, ...flashcards];
	}
}
