import StudiesRepository from '@lib/studies/application/ports/student-repository.interface';
import InMemoryStudiesRepository from './in-memory-repository';
import PostgresStudiesRepository from './postgres-repository';

export default {
	async getStudiesRepository(): Promise<StudiesRepository> {
		const connectionString = String(process.env.STUDENTS_DB);

		if (connectionString?.startsWith('postgres://')) {
			return new PostgresStudiesRepository(connectionString);
		}

		return new InMemoryStudiesRepository();

		// CHECK ENV and return the real one
	},
};
