import TranslatorInMemory from '@lib/infrastructure/translator/inMemory/translator-in-memory';
import TranslatorSqlite from '@lib/infrastructure/translator/sqlite/translator-sqlite';
import TranslatorPostgres from '@lib/infrastructure/translator/postgres/translator-postgres';
import Translator from '@lib/application/ports/translator.interface';
import Logger from '@lib/application/ports/logger.interface';

export default {
	async getTranslator(logger: Logger): Promise<Translator> {
		if (process.env.POSTGRES?.startsWith('postgres://')) {
			return new TranslatorPostgres(logger, process.env.POSTGRES);
		}

		return new TranslatorInMemory();
	},
};
