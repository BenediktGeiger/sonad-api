import { Bus } from '@lib/shared/bus/bus.interface';
import { Query } from '@lib/shared/bus/query.interface';
import { Command } from '@lib/shared/bus/command.interface';
import { QueryHandler } from '@lib/shared/bus/query-handler.interface';
import { CommandHandler } from '@lib/shared/bus/command-handler.interface';

import Logger from '@lib/dictionary/application/ports/logger.interface';
import LoggerBus from './logger-bus';
import RoutingBus from './routing-bus';
import RetryBus from './retry-bus';
import { GetDictionaryEntryQuery } from '@lib/dictionary/query/get-dictionary-entry-query';
import { GetDictionaryQueryHandler } from '@lib/dictionary/query/get-dictionary-entry-handler';
import ExternalDictionaryV2 from '@lib/dictionary/application/ports/external-dictionary-v2.interface';
import DictionaryCache from '@lib/dictionary/application/ports/dictionary-cache.interface';

export default {
	async getRoutingBus(
		logger: Logger,
		externalDictionary: ExternalDictionaryV2,
		dictionaryCache: DictionaryCache
	): Promise<Bus> {
		const commands: Map<string, CommandHandler<Command>> = new Map();
		const queries: Map<string, QueryHandler<Query>> = new Map();

		// Example of how to register a command handler
		// commands.set(FlashcardsCreateCommand.name, new FlashcardsCreateHandler(studiesRepository));

		queries.set(
			GetDictionaryEntryQuery.name,
			new GetDictionaryQueryHandler(externalDictionary, dictionaryCache, logger)
		);

		const routingBus = new RoutingBus(commands, queries);

		const loggerBus = new LoggerBus(logger, routingBus);
		return new RetryBus(loggerBus);
	},
};
