/* eslint-disable @typescript-eslint/no-explicit-any */
import { Command } from './command.interface';
import { Query } from './query.interface';
import { CommandHandlerResponse } from './command-handler.interface';
import { QueryHandlerResponse } from './query-handler.interface';

export interface Bus {
	execute(object: Command | Query): Promise<CommandHandlerResponse | QueryHandlerResponse>;
}
