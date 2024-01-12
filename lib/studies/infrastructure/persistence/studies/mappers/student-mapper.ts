import { Student } from '@lib/studies/domain/student';
import Mapper from '../../mapper.interface';
import { Name } from '@lib/studies/domain/value-objects/name';
import { StudySet } from '@lib/studies/domain/study-set';
import { Flashcard } from '@lib/studies/domain/flashcard';

export class StudentPostgresMapper implements Mapper<Student> {
	toPersistence(student: Student): string {
		const studentData = {
			firstname: student.firstname,
			lastname: student.lastname,
			studySets: student.studySets.map((studySet) => ({
				id: studySet.id,
				title: studySet.title,
				description: studySet.description,
				flashcards: studySet.flashcards.map((flashcard) => ({
					front: flashcard.front,
					back: flashcard.back,
				})),
			})),
		};

		return JSON.stringify(studentData);
	}

	toDomain(raw: any): Student {
		const { firstname, lastname, studySets, id } = raw;
		const name = Name.create(firstname, lastname);
		return new Student(
			name,
			studySets.map((studySet: any) => {
				return new StudySet(
					id,
					studySet.title,
					studySet.description,
					studySet.flashcards.map((flashcard: any) => {
						return new Flashcard({ studySetId: studySet.id, front: flashcard.front, back: flashcard.back });
					}),
					studySet.id
				);
			}),
			id
		);
	}
}
