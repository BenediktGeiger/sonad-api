import { Student } from '@lib/studies/domain/student';
import { FlashcardSample } from '@lib/studies/domain/value-objects/flashcard-sample';

import { UUID } from 'crypto';

// rename maybe to studies repository
export default interface StudiesRepository {
	// May have reference to other repos. For example flashcard repo or settings repo
	createStudent(student: Student): Promise<{ id: UUID }>;
	saveStudent(student: Student): Promise<{ id: UUID }>;
	getStudent(studentId: UUID): Promise<Student | null>;

	getRandomFlashcards(amount: number): Promise<FlashcardSample[]>;

	// addStudySet(studentId: UUID, studySet: StudySet): Promise<{ id: UUID }>;
	// getStudySets(studentId: UUID): Promise<StudySet[]>;
	// getStudySet(studentId: UUID, studySetId: UUID): Promise<StudySet | null>;

	// addFlashcard(flashcard: Flashcard): Promise<{ id: UUID }>;
	// getFlashcard(studentId: UUID, studySetId: UUID, flashcardId: UUID): Promise<Flashcard | null>;
}
