import Translator from '@lib/application/ports/translator.interface';
import LoggerInterface from '@lib/application/ports/logger.interface';

import { Pool } from 'pg';

export default class TranslatorPostgres implements Translator {
	private logger: LoggerInterface;
	private db: Pool;

	constructor(logger: LoggerInterface, connectionString: string) {
		this.logger = logger;

		const pool = new Pool({
			connectionString,
		});

		this.db = pool;
	}

	async translate(word: string): Promise<string | null> {
		try {
			const { rows } = await this.db.query('SELECT word_et FROM en_et WHERE word_en = $1', [word]);

			const estonianWord = rows[0]?.word_et;

			if (!estonianWord) {
				return '';
			}

			return estonianWord?.trim()?.split(',')?.[0]?.split(';')?.[0]?.trim() ?? null;

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			this.logger.error({
				message: `Unable to query postgress database: ${String(error?.message)}`,
				method: 'translate',
			});
			return null;
		}
	}
}
