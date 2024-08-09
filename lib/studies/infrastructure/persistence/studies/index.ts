import StudiesRepository from '@lib/studies/application/ports/student-repository.interface';
import InMemoryStudiesRepository from './in-memory-repository';
import PostgresStudiesRepository from './postgres-repository';
import config from '@lib/global-config';

export default {
	async getStudiesRepository(): Promise<StudiesRepository> {
		const connectionString = config.db.studies.url;

		if (connectionString?.startsWith('postgres://')) {
			return new PostgresStudiesRepository(connectionString);
		}

		return new InMemoryStudiesRepository();
	},
};
