import { CommandHandler } from '@lib/shared/bus/command-handler.interface';
import { CommandHandlerResponse } from '@lib/shared/bus/command-handler.interface';
import { RegisterUserCommand } from './register-user-command';
import IdentityAccessRepository from '../application/ports/identity-access-repository.interface';
import { randomUUID } from 'crypto';

export class RegisterUserHandler implements CommandHandler<RegisterUserCommand> {
	#identityAccessRepository: IdentityAccessRepository;

	constructor(identityAccessRepository: IdentityAccessRepository) {
		this.#identityAccessRepository = identityAccessRepository;
	}
	async execute(command: RegisterUserCommand): Promise<CommandHandlerResponse> {
		// TODO register user

		// const { id } = await this.#identityAccessRepository.saveUser(command.user);

		return { success: true, id: randomUUID() };
	}
}
