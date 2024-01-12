import TranslatorInMemory from '@lib/dictionary/infrastructure/translator/inMemory/translator-in-memory';
import TranslatorSqlite from '@lib/dictionary/infrastructure/translator/sqlite/translator-sqlite';
import TranslatorPostgres from '@lib/dictionary/infrastructure/translator/postgres/translator-postgres';
import Translator from '@lib/dictionary/application/ports/translator.interface';
import Logger from '@lib/dictionary/application/ports/logger.interface';

export default {
	async getTranslator(logger: Logger): Promise<Translator> {
		if (process.env.POSTGRES?.startsWith('postgres://')) {
			return new TranslatorPostgres(logger, process.env.POSTGRES);
		}

		return new TranslatorInMemory();
	},
};
