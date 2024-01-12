import { ValueObject } from '@lib/shared/domain/value-object';
import { UUID } from 'crypto';

interface MultipleChoiceOptionProps {
	id: UUID;
	flsahcardId: UUID;
	answer: string;
}

export class MultipleChoiceOption extends ValueObject<MultipleChoiceOptionProps> {
	private static readonly MAX_LENGTH = 50;

	private constructor(props: MultipleChoiceOptionProps) {
		super(props);
	}

	static create(props: MultipleChoiceOptionProps) {
		if (props.answer.length > this.MAX_LENGTH) {
			throw new Error('answer cannot be more than 50 characters');
		}

		return new MultipleChoiceOption(props);
	}
}
