import { AggregateRoot } from '@lib/shared/domain/aggregate-root';
import { UUID, randomUUID } from 'crypto';

interface UserProps {
	id: UUID;
	name: string;
	email: string;
}

export class User extends AggregateRoot<UserProps> {
	constructor(name: string, email: string, id?: UUID) {
		if (!id) {
			id = randomUUID();
		}

		const userId = id ?? randomUUID();

		super({ id: userId, name, email });
	}

	toJSON() {
		return {
			// id: this.id,
			name: this.name,
			email: this.email,
		};
	}

	static fromJSON({ id, name, email }: { id: UUID; name: string; email: string }): User {
		return new User(name, email, id);
	}

	get id() {
		return this.props.id;
	}

	get email() {
		return this.props.email;
	}

	get name() {
		return this.props.name;
	}
}
