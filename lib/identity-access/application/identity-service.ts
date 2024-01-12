import { Bus } from '@lib/shared/bus/bus.interface';
import { CommandHandlerResponse } from '@lib/shared/bus/command-handler.interface';
import { User } from '../domain/user';
import { RegisterUserDto, RegisterUserResponseDto } from './dtos/register-user.dto';
import { RegisterUserCommand } from '../command/register-user-command';
export default class IdentityService {
	private routingBus: Bus;

	constructor(routingBus: Bus) {
		this.routingBus = routingBus;
	}

	async registerUserAction(dto: RegisterUserDto): Promise<RegisterUserResponseDto | null> {
		try {
			const user = new User(dto.name, dto.email);

			const routingBusResponse = (await this.routingBus.execute(
				new RegisterUserCommand(user)
			)) as CommandHandlerResponse;

			const { success, id } = routingBusResponse;

			if (!success || !id) {
				return null;
			}

			return new RegisterUserResponseDto(routingBusResponse.id);
		} catch (error) {
			throw new Error('invalid student name');
		}
	}
}
