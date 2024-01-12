import { UUID } from 'crypto';
import { Command } from './command.interface';

export type CommandHandlerResponse = {
	success: boolean;
	id: UUID;
};

export interface CommandHandler<TCommand extends Command> {
	execute(command: TCommand): Promise<CommandHandlerResponse>;
}
