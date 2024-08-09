import TranslatorInMemory from '@lib/dictionary/infrastructure/translator/inMemory/translator-in-memory';
import TranslatorPostgres from '@lib/dictionary/infrastructure/translator/postgres/translator-postgres';
import Translator from '@lib/dictionary/application/ports/translator.interface';
import Logger from '@lib/dictionary/application/ports/logger.interface';
import config from '@lib/global-config';

export default {
	async getTranslator(logger: Logger): Promise<Translator> {
		const translatorUrl = config.db.translator.url;
		if (translatorUrl.startsWith('postgres://')) {
			return new TranslatorPostgres(logger, translatorUrl);
		}

		return new TranslatorInMemory();
	},
};
