import express from 'express';
import DictionaryController from '@lib/web-interface/http/core/controllers/dictionaryController';
import { Services } from '@lib/config/service-locator';
import { sanitizer } from '@lib/web-interface/http/core/middlewares/index';
import { register } from '@lib/web-interface/http/core/prom';
import DictionaryV2Controller from '../controllers/dictionaryV2Controller';
import StudiesController from '../controllers/studiesController';

const router = express.Router();

const routerV2 = express.Router();

const Endpoints = Object.freeze({
	WORD: '/:word',
	PART_OF_SPEECH: '/:word/partofspeech',
	WORD_FORMS: '/:word/wordforms',
	MEANINGS: '/:word/meanings',
	METRICS: '/metrics',
	FLASHCARDS: '/flashcards',
});

const EndpointsV2 = Object.freeze({
	SEARCH: '/:searchTerm',
	GET_LUCKY: '/getLucky',
	ASCII: '/ascii/:searchTerm',
});

const StudiesEndpoints = Object.freeze({
	STUDENTS: '/students',
	STUDENTS_STUDENT_BY_ID: '/students/:id',
	STUDENTS_STUDY_SETS: '/students/:studentId/studysets',
	STUDENTS_FLASHCARDS: '/students/:studentId/studysets/:studySetId/flashcards',
	FLASHCARD_GET_LUCKY: '/flashcards/getlucky',
});

export default (server: express.Express, services: Services) => {
	const dictionaryController = new DictionaryController(
		services.dictionaryService,
		services.translatorService,
		services.logger
	);

	const dictionaryV2Controller = new DictionaryV2Controller(services.dictionaryV2Service, services.translatorService);

	const studiesController = new StudiesController(services.studiesService);

	router.get(Endpoints.WORD, sanitizer, dictionaryController.getWord());
	router.get(Endpoints.PART_OF_SPEECH, sanitizer, dictionaryController.getPartOfSpeech());
	router.get(Endpoints.WORD_FORMS, sanitizer, dictionaryController.getWordForms());
	router.get(Endpoints.MEANINGS, sanitizer, dictionaryController.getMeanings());
	router.get(Endpoints.MEANINGS, sanitizer, dictionaryController.getMeanings());

	router.get('*', function (req, res) {
		res.status(404).json({
			message: 'Not found',
			status: 404,
		});
	});

	routerV2.get(EndpointsV2.GET_LUCKY, sanitizer, dictionaryV2Controller.getLucky());
	routerV2.get(EndpointsV2.SEARCH, sanitizer, dictionaryV2Controller.searchWord());
	routerV2.get(EndpointsV2.ASCII, sanitizer, dictionaryV2Controller.ascii());

	// studies
	routerV2.post(StudiesEndpoints.STUDENTS, sanitizer, studiesController.createStudent());
	routerV2.get(StudiesEndpoints.STUDENTS_STUDENT_BY_ID, sanitizer, studiesController.getStudentById());
	routerV2.post(StudiesEndpoints.STUDENTS_STUDY_SETS, sanitizer, studiesController.createStudySet());
	routerV2.post(StudiesEndpoints.STUDENTS_FLASHCARDS, sanitizer, studiesController.createFlashcards());

	routerV2.get(StudiesEndpoints.FLASHCARD_GET_LUCKY, sanitizer, studiesController.getRandomFlashcards());

	server.use(Endpoints.METRICS, async function (req, res) {
		res.setHeader('Content-type', register.contentType);
		res.end(await register.metrics());
	});

	server.use('/v1', router);
	server.use('/v2', routerV2);
};
