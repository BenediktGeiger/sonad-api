import StudiesRepository from '@lib/studies/application/ports/student-repository.interface';
import { Student } from '@lib/studies/domain/student';
import { UUID, randomUUID } from 'crypto';
import { Pool } from 'pg';
import Mapper from '../mapper.interface';
import { StudentPostgresMapper } from './mappers/student-mapper';
import { FlashcardSamplePostgresMapper } from './mappers/flashcard-sample-mapper';
import { FlashcardSample } from '@lib/studies/domain/value-objects/flashcard-sample';

export default class PostgresStudiesRepository implements StudiesRepository {
	private db: Pool;
	private studentMapper: Mapper<Student>;
	private flashcardSampleMapper: Mapper<FlashcardSample>;

	constructor(connectionString: string) {
		const pool = new Pool({
			connectionString,
		});

		this.db = pool;
		this.studentMapper = new StudentPostgresMapper();
		this.flashcardSampleMapper = new FlashcardSamplePostgresMapper();
	}

	async createStudent(student: Student): Promise<{ id: UUID }> {
		try {
			const sql = 'INSERT into students(id, data) VALUES($1, $2) RETURNING *';

			// domain to persistence
			const result = await this.db.query(sql, [student.id, this.studentMapper.toPersistence(student)]);

			return {
				id: result.rows[0].id,
			};
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	async saveStudent(student: Student): Promise<{ id: UUID }> {
		try {
			const sql = 'UPDATE students SET data = $1 WHERE id = $2 RETURNING *';

			// domain to persistence happens
			const result = await this.db.query(sql, [this.studentMapper.toPersistence(student), student.id]);

			return {
				id: result.rows[0]?.id ?? randomUUID(),
			};
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	async getStudent(studentId: UUID): Promise<Student | null> {
		try {
			const { rows } = await this.db.query('SELECT * FROM students WHERE id = $1', [studentId]);

			if (!rows.length) {
				return null;
			}

			const { data, id } = rows[0];

			return this.studentMapper.toDomain({
				...data,
				id,
			});
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	private randomIntFromInterval(min: number, max: number) {
		// min and max included
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	async getRandomFlashcards(amount: number): Promise<FlashcardSample[]> {
		try {
			const result = await this.db.query(
				'SELECT count(*) AS ct, min(id)  AS min_id, max(id)  AS max_id, max(id) - min(id) AS id_span FROM flashcard_samples;'
			);

			const { min_id, max_id } = result.rows[0];

			const ids = [];
			for (let i = 0; i < amount; i++) {
				ids.push(this.randomIntFromInterval(min_id, max_id));
			}

			const { rows } = await this.db.query('SELECT * FROM flashcard_samples WHERE id = ANY($1::int[])', [ids]);

			return rows.map((row) => {
				const { data } = row;
				return this.flashcardSampleMapper.toDomain(data);
			});
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	// async addStudySet(studentId: UUID, studySet: StudySet): Promise<{ id: UUID }> {
	// 	try {
	// 		// 'INSERT INTO study_sets (student,title,description) VALUES ('cc5f2c22-3b98-4c04-b2ca-03d3d72cce54','title', 'description')'
	// 		const sql = 'INSERT INTO study_sets (id, student, title, description) VALUES ($1, $2, $3, $4) RETURNING *';
	// 		// domain to persistence
	// 		const result = await this.db.query(sql, [studySet.id, studentId, studySet.title, studySet.description]);

	// 		return {
	// 			id: result.rows[0].id,
	// 		};
	// 	} catch (error) {
	// 		console.log(error);
	// 		throw error;
	// 	}
	// }
	// private async getStudySets(studentId: UUID): Promise<StudySet[]> {
	// 	try {
	// 		const { rows } = await this.db.query('SELECT * FROM study_sets WHERE student = $1', [studentId]);

	// 		const studySets: StudySet[] = await Promise.all(
	// 			rows.map(async (row) => {
	// 				const flashcards = await this.getFlashcards(row.id);
	// 				const studySet = new StudySet(row.id, studentId, row.title, row.description, flashcards);

	// 				return studySet;
	// 			})
	// 		);

	// 		return studySets;

	// 		// TODO persistence to domain
	// 	} catch (error) {
	// 		console.log(error);
	// 		throw error;
	// 	}
	// }

	// private async getFlashcards(studySetId: UUID): Promise<Flashcard[]> {
	// 	try {
	// 		const { rows } = await this.db.query('SELECT * FROM flashcards WHERE study_set = $1', [studySetId]);

	// 		const flashcards: Flashcard[] = rows.map((row) => {
	// 			const flashcard = new Flashcard({
	// 				studySetId: row.study_set,
	// 				front: row.front,
	// 				back: row.back,
	// 			});

	// 			return flashcard;
	// 		});

	// 		return flashcards;

	// 		// TODO persistence to domain
	// 	} catch (error) {
	// 		console.log(error);
	// 		throw error;
	// 	}
	// }

	// async getStudySet(studentId: UUID, studySetId: UUID): Promise<StudySet | null> {
	// 	return null;
	// }
	// async addFlashcard(flashcard: Flashcard): Promise<{ id: UUID }> {
	// 	try {
	// 		// 'INSERT INTO study_sets (student,title,description) VALUES ('cc5f2c22-3b98-4c04-b2ca-03d3d72cce54','title', 'description')'
	// 		const sql = 'INSERT INTO flashcards (id, study_set, front, back) VALUES ($1, $2, $3, $4) RETURNING *';
	// 		// domain to persistence
	// 		const result = await this.db.query(sql, [flashcard.studySetId, flashcard.front, flashcard.back]);

	// 		return {
	// 			id: result.rows[0].id,
	// 		};
	// 	} catch (error) {
	// 		console.log(error);
	// 		throw error;
	// 	}
	// }
	// getFlashcard(studentId: UUID, studySetId: UUID, flashcardId: UUID): Promise<Flashcard | null> {
	// 	throw new Error('Method not implemented.');
	// }
}
