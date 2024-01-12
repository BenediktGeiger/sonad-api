import { Query } from '@lib/shared/bus/query.interface';
import { UUID } from 'crypto';

export class GetStudentQuery implements Query {
	_type = 'query';
	#id: UUID;

	constructor(id: UUID) {
		this.#id = id;
	}

	get id(): UUID {
		return this.#id;
	}
}
