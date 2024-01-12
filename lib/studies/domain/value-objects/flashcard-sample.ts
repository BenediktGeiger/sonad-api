import { ValueObject } from '@lib/shared/domain/value-object';

interface FlashcardSampleProps {
	front: {
		clue: string;
	};
	back: {
		answer: string;
		wordForms: string;
		examples: string[];
	};
}

export class FlashcardSample extends ValueObject<FlashcardSampleProps> {
	private static readonly MAX_LENGTH = 50;

	private constructor(props: FlashcardSampleProps) {
		super(props);
	}

	get front() {
		return this.props.front;
	}

	get back() {
		return this.props.back;
	}

	static create(clue: string, answer: string, wordForms: string, examples: string[]) {
		// implement some business rules

		// if (firstname.length > this.MAX_LENGTH) {
		// 	throw new Error('First name cannot be more than 50 characters');
		// }
		// if (lastname.length > this.MAX_LENGTH) {
		// 	throw new Error('Last name cannot be more than 50 characters');
		// }

		return new FlashcardSample({ front: { clue }, back: { answer, wordForms, examples } });
	}
}
