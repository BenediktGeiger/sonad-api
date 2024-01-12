import StudiesRepository from '@lib/studies/application/ports/student-repository.interface';
import { Flashcard, FlashcardProps } from '@lib/studies/domain/flashcard';
import { Student } from '@lib/studies/domain/student';
import { StudySet } from '@lib/studies/domain/study-set';
import { FlashcardSample } from '@lib/studies/domain/value-objects/flashcard-sample';
import { UUID } from 'crypto';
export default class InMemoryStudiesRepository implements StudiesRepository {
	students: Student[];
	constructor() {
		this.students = [];
	}
	getRandomFlashcards(): Promise<FlashcardSample[]> {
		throw new Error('Method not implemented.');
	}
	saveStudent(student: Student): Promise<{ id: `${string}-${string}-${string}-${string}-${string}` }> {
		throw new Error('Method not implemented.');
	}
	async createStudent(student: Student): Promise<{ id: UUID }> {
		this.students.push(student);

		return {
			id: student.id,
		};
	}
	async getStudent(studentId: UUID): Promise<Student | null> {
		const student = this.students.find((student) => student.id === studentId);

		if (!student) {
			return null;
		}

		return student;
	}

	async addStudySet(studentId: UUID, studySet: StudySet): Promise<{ id: UUID }> {
		const student = this.students.find((student) => student.id === studentId);

		if (!student) {
			throw new Error('Student not found');
		}

		const foundIndex = this.students.findIndex((student) => student.id == studentId);

		student.addStudySet(studySet);

		this.students[foundIndex] = student;

		return { id: studySet.id };
	}
	async getStudySets(studentId: UUID): Promise<StudySet[]> {
		const student = this.students.find((student) => student.id === studentId);

		if (!student) {
			return [];
		}

		return student.studySets;
	}
	async getStudySet(studentId: UUID, studySetId: UUID): Promise<StudySet | null> {
		const student = this.students.find((student) => student.id === studentId);

		if (!student) {
			return null;
		}

		const studySet = student.studySets.find((studySet) => studySet.id === studySetId);

		if (!studySet) {
			return null;
		}

		return studySet;
	}
	addFlashcard(studentId: UUID, studySetId: UUID, flashcardProps: FlashcardProps): Promise<{ id: UUID }> {
		throw new Error('Method not implemented.');
	}
	getFlashcard(studentId: UUID, studySetId: UUID, flashcardId: UUID): Promise<Flashcard | null> {
		throw new Error('Method not implemented.');
	}
}
