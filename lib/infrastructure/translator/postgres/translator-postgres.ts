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

	private removeSpecialCharacters(str: string): string {
		return str.replace(/[(){}[\]]/g, '');
	}

	async translate(word: string): Promise<string | null> {
		try {
			const { rows } = await this.db.query('SELECT word_et FROM en_et WHERE word_en = $1', [word]);

			const estonianWord = rows[0]?.word_et;

			if (!estonianWord) {
				return '';
			}

			return (
				this.removeSpecialCharacters(estonianWord)
					?.trim()
					?.split(' ')?.[0]
					.split(',')?.[0]
					?.split(';')?.[0]
					?.trim() ?? null
			);

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			this.logger.error({
				message: `Unable to query postgress database: ${String(error?.message)}`,
				method: 'translate',
			});
			return null;
		}
	}

	private getDbQuery(from: string, to: string): string | null {
		if (from === 'et' && to === 'en') {
			return 'SELECT word_en FROM et_en WHERE word_et LIKE $1';
		}

		if (from === 'en' && to === 'et') {
			return 'SELECT word_et FROM en_et WHERE word_en LIKE $1';
		}

		return null;
	}

	private getColumnName(from: string, to: string): string {
		if (from === 'et' && to === 'en') {
			return 'word_en';
		}

		return 'word_et';
	}

	async getTranslations(term: string, from: string, to: string): Promise<string[]> {
		try {
			const dbQuery = this.getDbQuery(from, to);

			if (!dbQuery) {
				throw new Error('direction mismatch');
			}

			const { rows } = await this.db.query(dbQuery, [term]);
			const translations = rows[0]?.[this.getColumnName(from, to)];

			if (!translations) {
				return [];
			}

			return translations
				.split(';')
				.reduce((acc: string[], curr: string) => {
					const splittedByComma = curr.split(',');

					return [...acc, ...splittedByComma];
				}, [])
				.map((word: string) => word.trim());

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			this.logger.error({
				message: `Unable to query postgress database: ${String(error?.message)}`,
				method: 'getTranslations',
			});
			return [];
		}
	}
}
