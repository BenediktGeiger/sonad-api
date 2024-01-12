import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../middlewares/error-handler';
import { FlashcardsCreateDto } from '@lib/studies/application/dtos/flashcards-create.dto';
import StudiesService from '@lib/studies/application/studies-service';
import { StudentCreateDto } from '@lib/studies/application/dtos/student-create.dto';
import { isValidUUIDv4 } from '@lib/shared/common/is-valid-uuid-4';
import { StudentGetDto } from '@lib/studies/application/dtos/student-get.dto';
import { StudySetCreateDto } from '@lib/studies/application/dtos/study-set-create.dto';
import { RandomFlashcardsGetDto } from '@lib/studies/application/dtos/random-flashcards-get.dto';

export default class StudiesController {
	private studiesService: StudiesService;

	constructor(studiesService: StudiesService) {
		this.studiesService = studiesService;
	}

	// come up with a responseClass

	createStudent = () => async (req: Request, res: Response, next: NextFunction) => {
		const { body } = req;

		const { firstname, lastname } = body;

		if (!firstname || !lastname) {
			return next(new CustomError(`invalid body`, 400));
		}

		try {
			const result = await this.studiesService.createStudentAction(new StudentCreateDto(firstname, lastname));

			if (!result) {
				return next(new CustomError(`unable to create student`, 400));
			}
			res.json({ id: result.id });
		} catch (err) {
			return next(new CustomError('Something went wrong', 500));
		}
	};

	createStudySet = () => async (req: Request, res: Response, next: NextFunction) => {
		const { body, params } = req;

		const { title, description, flashcards } = body;

		const { studentId } = params;

		if (!isValidUUIDv4(studentId)) {
			return next(new CustomError(`no id found`, 400));
		}

		if (!title || !description) {
			return next(new CustomError(`invalid body`, 400));
		}

		try {
			const result = await this.studiesService.addStudySetAction(
				new StudySetCreateDto(studentId, title, description, flashcards)
			);

			if (!result) {
				return next(new CustomError(`unable to create student`, 400));
			}
			res.json({ id: result.id });
		} catch (err) {
			return next(new CustomError('Something went wrong', 500));
		}
	};

	createFlashcards = () => async (req: Request, res: Response, next: NextFunction) => {
		const { body, params } = req;

		const { studentId, studySetId } = params;

		if (!isValidUUIDv4(studentId)) {
			return next(new CustomError(`Invalid studentId`, 400));
		}

		if (!isValidUUIDv4(studySetId)) {
			return next(new CustomError(`Invalid studySetId`, 400));
		}

		if (!body?.length) {
			return next(new CustomError(`invalid body`, 400));
		}

		try {
			const result = await this.studiesService.addFlashCardsAction(
				new FlashcardsCreateDto(studentId, studySetId, body)
			);

			if (!result) {
				return next(new CustomError(`unable to create student`, 400));
			}
			res.json({ id: result.id });
		} catch (err) {
			return next(new CustomError('Something went wrong', 500));
		}
	};

	getStudentById = () => async (req: Request, res: Response, next: NextFunction) => {
		const id = req?.params?.id;

		if (!isValidUUIDv4(id)) {
			return next(new CustomError(`no id found`, 400));
		}

		try {
			const result = await this.studiesService.getStudentQuery(new StudentGetDto(id));

			if (!result) {
				return next(new CustomError(`no student found`, 404));
			}

			res.json(result.serialize());
		} catch (err) {
			return next(new CustomError(' went wrong', 404));
		}
	};

	getRandomFlashcards = () => async (req: Request, res: Response, next: NextFunction) => {
		const { amount } = req.query;

		// check if amount is a number

		try {
			const result = await this.studiesService.getRandomFlashcardsQuery(
				new RandomFlashcardsGetDto(Number(amount) ?? 10)
			);

			if (!result) {
				return next(new CustomError(`no student found`, 404));
			}

			res.json(result.serialize());
		} catch (err) {
			return next(new CustomError('Something went wrong', 404));
		}
		// https://www.cl.ut.ee/ressursid/sagedused/
		// https://www.cl.ut.ee/ressursid/sagedused/table1.txt
		// res.json([
		// 	{
		// 		front: {
		// 			clue: 'avenue , haul , path , road , tea (jook) , thoroughfare , way',
		// 		},
		// 		back: {
		// 			answer: 'tee',
		// 			definition:
		// 				'käimiseks ja sõitmiseks kasutatav (ning selleks ettevalmistatud) pinnaseriba,maa-ala, millel sa kõnnid või kus autod sõidavad',
		// 			wordForms: 'tee, tee, teed',
		// 			examples: ['Asfalttee', 'Kruusatee', 'Teed on libedad.'],
		// 		},
		// 	},
		// 	{
		// 		front: {
		// 			clue: 'do it , (kellegagi) get laid , go to bed with , have sex , kip , sleep , (kellegagi) sleep with',
		// 		},
		// 		back: {
		// 			word: 'magama',
		// 			definition:
		// 				'uneseisundis olema, mitte ärkvel olema,suletud silmadega puhkama, nagu sa seda öösel teed',
		// 			wordForms: 'magama, magada, magab, magas',
		// 			examples: [
		// 				'Mis kell sa eile magama läksid?',
		// 				'Köha ei lasknud öösel magada.',
		// 				'Maga ennast kaineks!',
		// 			],
		// 		},
		// 	},
		// 	{
		// 		front: { clue: 'where , wherein' },
		// 		back: {
		// 			word: 'kus',
		// 			definition: 'küsiv-siduv sõna: missuguses kohas,mis kohas',
		// 			wordForms: 'kus',
		// 			examples: ['Kus sa elad?', 'Kus ta on?', 'Ma ei saanud aru, kus viibin.'],
		// 		},
		// 	},
		// ]);

		// try {
		// 	const result = await this.studiesService.getStudentQuery(new StudentGetDto(id));

		// 	if (!result) {
		// 		return next(new CustomError(`no student found`, 404));
		// 	}

		// 	res.json(result.serialize());
		// } catch (err) {
		// 	return next(new CustomError(' went wrong', 404));
		// }
	};
}
