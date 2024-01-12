import { Command } from '@lib/shared/bus/command.interface';
import { User } from '../domain/user';

export class RegisterUserCommand implements Command {
	_type = 'command';
	#user: User;

	constructor(user: User) {
		this.#user = user;
	}

	get user() {
		return this.#user;
	}
}
