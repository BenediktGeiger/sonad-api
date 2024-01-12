import { StudySet } from './study-set';

export class StudySetSettings {
	studySetId: Pick<StudySet, 'id'>;
	answerWith: 'front' | 'back';

	constructor(studySetId: Pick<StudySet, 'id'>, answerWith?: 'front' | 'back') {
		this.studySetId = studySetId;
		this.answerWith = answerWith ?? 'back';
	}
}
