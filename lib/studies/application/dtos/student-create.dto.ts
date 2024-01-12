import { UUID } from 'crypto';

export class StudentCreateDto {
	#firstname: string;
	#lastname: string;

	constructor(firstname: string, lastname: string) {
		this.#firstname = firstname;
		this.#lastname = lastname;
	}

	get firstname() {
		return this.#firstname;
	}

	get lastname() {
		return this.#lastname;
	}
}

export class StudentCreateDtoResponseDto {
	#id: UUID | number;

	constructor(id: UUID | number) {
		this.#id = id;
	}

	get id() {
		return this.#id;
	}
}
