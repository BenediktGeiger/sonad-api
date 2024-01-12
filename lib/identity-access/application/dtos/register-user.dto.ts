import { UUID } from 'crypto';

export class RegisterUserDto {
	#name: string;
	#email: string;

	constructor(name: string, email: string) {
		this.#name = name;
		this.#email = email;
	}

	get name() {
		return this.#name;
	}

	get email() {
		return this.#email;
	}
}

export class RegisterUserResponseDto {
	#id: UUID | number;

	constructor(id: UUID | number) {
		this.#id = id;
	}

	get id() {
		return this.#id;
	}
}
