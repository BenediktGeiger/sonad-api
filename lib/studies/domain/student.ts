// this is my aggregate root
import { AggregateRoot } from '@lib/shared/domain/aggregate-root';
import { StudySet } from './study-set';
import { Name } from './value-objects/name';
import { UUID, randomUUID } from 'crypto';
import { Flashcard } from './flashcard';

interface StudentProps {
	id: UUID;
	name: Name;
	studySets: StudySet[];
}

export class Student extends AggregateRoot<StudentProps> {
	constructor(name: Name, studySets: StudySet[], id?: UUID) {
		if (!id) {
			id = randomUUID();
		}

		const studentId = id ?? randomUUID();

		super({ id: studentId, name, studySets });
	}

	toJSON() {
		return {
			// id: this.id,
			firstname: this.firstname,
			lastname: this.lastname,
			studySets: this.studySets.map((studySet) => studySet.toJSON()),
		};
	}

	static fromJSON({
		id,
		firstname,
		lastname,
		studySets,
	}: {
		id: UUID;
		firstname: string;
		lastname: string;
		studySets: {
			id: UUID;
			title: string;
			description: string;
			flashcards: {
				front: string;
				back: string;
			}[];
		}[];
	}): Student {
		const name = Name.create(firstname, lastname);
		return new Student(
			name,
			studySets.map((studySet) =>
				StudySet.fromJSON({
					...studySet,
					studentId: id,
				})
			),
			id
		);
	}

	get id() {
		return this.props.id;
	}

	get studySets() {
		return this.props.studySets;
	}

	get name() {
		return this.props.name.fullname;
	}

	get firstname() {
		return this.props.name.firstname;
	}

	get lastname() {
		return this.props.name.lastname;
	}

	addStudySet(studySet: StudySet) {
		this.props.studySets.push(studySet);
	}

	addFlashcards(studySetId: UUID, flashcards: Flashcard[]): StudySet {
		const studySet = this.props.studySets.find((studySet) => studySet.id === studySetId);

		if (!studySet) {
			throw new Error('study set not found');
		}

		studySet.addFlashcards(flashcards);

		return studySet;
	}
}
