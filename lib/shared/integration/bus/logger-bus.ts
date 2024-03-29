import { Bus } from '../../bus/bus.interface';
import { Command } from '../../bus/command.interface';
import { Query } from '../../bus/query.interface';
import Logger from '@lib/studies/application/ports/logger.interface';
import { CommandHandlerResponse } from '@lib/shared/bus/command-handler.interface';
import { QueryHandlerResponse } from '@lib/shared/bus/query-handler.interface';

export default class LoggerBus implements Bus {
	private logger: Logger;
	private bus: Bus;

	constructor(logger: Logger, bus: Bus) {
		this.logger = logger;
		this.bus = bus;
	}

	async execute(object: Command | Query): Promise<CommandHandlerResponse | QueryHandlerResponse> {
		this.logger.info({}, 'start');

		const result = await this.bus.execute(object);

		this.logger.info({}, 'end');

		return result;
	}
}
