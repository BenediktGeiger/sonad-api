import { ValueObject } from '@lib/shared/domain/value-object';

interface NameProps {
	firstname: string;
	lastname: string;
}

export class Name extends ValueObject<NameProps> {
	private static readonly MAX_LENGTH = 50;

	private constructor(props: NameProps) {
		super(props);
	}

	get firstname() {
		return this.props.firstname;
	}

	get lastname() {
		return this.props.lastname;
	}

	get fullname() {
		return `${this.props.firstname} ${this.props.lastname}`;
	}

	static create(firstname: string, lastname: string) {
		if (firstname.length > this.MAX_LENGTH) {
			throw new Error('First name cannot be more than 50 characters');
		}
		if (lastname.length > this.MAX_LENGTH) {
			throw new Error('Last name cannot be more than 50 characters');
		}

		return new Name({ firstname, lastname });
	}
}
