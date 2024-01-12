import Mapper from '../../mapper.interface';
import { FlashcardSample } from '@lib/studies/domain/value-objects/flashcard-sample';

export class FlashcardSamplePostgresMapper implements Mapper<FlashcardSample> {
	toPersistence(flashcard: FlashcardSample): string {
		const flashcardSampleData = {
			front: flashcard.front,
			back: flashcard.back,
			// studySets: student.studySets.map((studySet) => ({
			// 	id: studySet.id,
			// 	title: studySet.title,
			// 	description: studySet.description,
			// 	flashcards: studySet.flashcards.map((flashcard) => ({
			// 		front: flashcard.front,
			// 		back: flashcard.back,
			// 	})),
			// })),
		};

		return JSON.stringify(flashcardSampleData);
	}

	toDomain(raw: any): FlashcardSample {
		const { front, back } = raw;
		return FlashcardSample.create(front.clue, back.answer, back.wordForms, back.examples);
	}
}
