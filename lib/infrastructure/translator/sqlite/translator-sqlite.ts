import Translator from '@lib/application/ports/translator.interface';
import LoggerInterface from '@lib/application/ports/logger.interface';

import { Database, OPEN_READONLY } from 'sqlite3';

export default class TranslatorSqlite implements Translator {
	private logger: LoggerInterface;
	private db: Database;

	constructor(logger: LoggerInterface, filepath: string) {
		this.logger = logger;

		this.db = new Database(filepath, OPEN_READONLY, (err) => {
			if (err) {
				this.logger.error({
					message: err?.message ?? 'Unable to connect to sqlite database',
					method: 'TranslatorSqlite constructor',
				});

				throw err;
			}
			this.logger.info({
				message: 'Connected to the sql lite database.',
				method: 'TranslatorSqlite constructor',
			});
		});
	}

	async translate(word: string): Promise<string | null> {
		const query = `SELECT * FROM 'en_et' WHERE word_en = ?`;

		try {
			const result = await this.readDbPromise(query, [word]);
			return result?.trim()?.split(',')?.[0]?.split(';')?.[0]?.trim() ?? null;
		} catch (err) {
			this.logger.error({
				message: 'Unable to query sqlite database',
				method: 'translate',
			});
			return null;
		}
	}

	private async readDbPromise(query: string, params: string[]): Promise<string> {
		return new Promise((resolve, reject) => {
			this.db.all(query, params, async (err, rows) => {
				if (err) {
					return reject(err);
				}

				const estonianWord = rows[0]?.word_et;

				if (!estonianWord) {
					return resolve('');
				}

				return resolve(estonianWord);
			});
		});
	}
}
