import { Entity } from '@lib/shared/domain/entity';
import { MultipleChoiceOption } from './multiple-choice-option';
import { UUID } from 'crypto';
import { ValueObject } from '@lib/shared/domain/value-object';

export interface FlashcardProps {
	studySetId: UUID;
	front: string;
	back: string;
	multipleChoiceOptions?: MultipleChoiceOption[];
}

// FlashCard is a entity object since it does not have an identity and is only determined by its properties
export class Flashcard extends ValueObject<FlashcardProps> {
	// #front: string;
	// #back: string;
	// #multipleChoiceOptions: MultipleChoiceOption[];

	constructor(props: FlashcardProps) {
		const { multipleChoiceOptions } = props;

		// this.#front = front;
		// this.#back = back;

		if (multipleChoiceOptions?.length && multipleChoiceOptions.length > 3) {
			throw new Error('Multiple choice options cannot be more than 4');
		}
		super(props);

		// this.#multipleChoiceOptions = multipleChoiceOptions ?? [];
	}

	toJSON() {
		return {
			front: this.front,
			back: this.back,
		};
	}

	static fromJSON({ front, back, studySetId }: { front: string; back: string; studySetId: UUID }): Flashcard {
		return new Flashcard({ studySetId, front, back });
	}

	get front() {
		return this.props.front;
	}

	get back() {
		return this.props.back;
	}

	get studySetId() {
		return this.props.studySetId;
	}
}
