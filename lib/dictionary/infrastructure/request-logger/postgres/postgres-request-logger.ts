import RequestLogger from '@lib/dictionary/application/ports/request-logger.interface';
import LoggerInterface from '@lib/dictionary/application/ports/logger.interface';
import { Request } from 'express';

import { Pool } from 'pg';

export default class PostgresRequestLogger implements RequestLogger {
	private logger: LoggerInterface;
	private db: Pool;

	constructor(logger: LoggerInterface, connectionString: string) {
		this.logger = logger;
		const pool = new Pool({
			connectionString,
		});

		this.db = pool;
	}

	async logRequest(req: Request): Promise<void> {
		try {
			const { ip, hostname, method, originalUrl, baseUrl, url } = req;

			const dbQuery =
				'INSERT INTO requests(ip, hostname, method, originalUrl, baseUrl, url) VALUES($1, $2, $3, $4, $5, $6)';
			const values = [ip, hostname, method, originalUrl, baseUrl, url];

			await this.db.query(dbQuery, values);
		} catch (error) {
			this.logger.error({
				message: 'Unable to store request',
				context: 'LOG_REQUEST',
				error: JSON.stringify(error),
			});
		}
	}
}
