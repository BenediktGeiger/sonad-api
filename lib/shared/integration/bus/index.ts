import { Bus } from '@lib/shared/bus/bus.interface';
import { Query } from '@lib/shared/bus/query.interface';
import { Command } from '@lib/shared/bus/command.interface';
import { QueryHandler } from '@lib/shared/bus/query-handler.interface';
import { CommandHandler } from '@lib/shared/bus/command-handler.interface';

import { FlashcardsCreateCommand } from '@lib/studies/command/flashcards-create-command';
import { FlashcardsCreateHandler } from '@lib/studies/command/flashcards-create-handler';

import Logger from '@lib/studies/application/ports/logger.interface';
import LoggerBus from './logger-bus';
import RoutingBus from './routing-bus';
import RetryBus from './retry-bus';
import { StudentCreateHandler } from '@lib/studies/command/create-student-handler';
import StudiesRepository from '@lib/studies/application/ports/student-repository.interface';
import { StudentCreateCommand } from '@lib/studies/command/create-student-command';
import { GetStudentQueryHandler } from '@lib/studies/query/get-student-handler';
import { GetStudentQuery } from '@lib/studies/query/get-student-query';
import { StudySetCreateCommand } from '@lib/studies/command/create-study-set-command';
import { StudySetCreateHandler } from '@lib/studies/command/create-study-set-handler';
import { GetRandomFlashcardQueryHandler } from '@lib/studies/query/get-random-flashcard-handler';
import { GetRandomFlashcardsQuery } from '@lib/studies/query/get-random-flashcard-query';

export default {
	async getRoutingBus(studiesRepository: StudiesRepository, logger: Logger): Promise<Bus> {
		const commands: Map<string, CommandHandler<Command>> = new Map();
		const queries: Map<string, QueryHandler<Query>> = new Map();

		commands.set(StudentCreateCommand.name, new StudentCreateHandler(studiesRepository));
		commands.set(StudySetCreateCommand.name, new StudySetCreateHandler(studiesRepository));
		commands.set(FlashcardsCreateCommand.name, new FlashcardsCreateHandler(studiesRepository));

		queries.set(GetStudentQuery.name, new GetStudentQueryHandler(studiesRepository));
		queries.set(GetRandomFlashcardsQuery.name, new GetRandomFlashcardQueryHandler(studiesRepository));

		const routingBus = new RoutingBus(commands, queries);

		const loggerBus = new LoggerBus(logger, routingBus);
		return new RetryBus(loggerBus);
	},
};
