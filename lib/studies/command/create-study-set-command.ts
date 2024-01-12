import { Command } from '@lib/shared/bus/command.interface';
import { StudySet } from '../domain/study-set';

export class StudySetCreateCommand implements Command {
	_type = 'command';
	#studySet: StudySet;

	constructor(studySet: StudySet) {
		this.#studySet = studySet;
	}

	get studySet() {
		return this.#studySet;
	}
}
