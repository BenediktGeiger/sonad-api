import express from 'express';
import DictionaryController from '@lib/presentation/http/controllers/dictionaryController';
import DictionaryService from '@lib/application/dictionary-service';
import { Services } from '@lib/config/service-locator';

const router = express.Router();

const Endpoints = Object.freeze({
	WORD: '/:word',
	PART_OF_SPEECH: '/:word/partofspeech',
	WORD_FORMS: '/:word/wordforms',
	MEANINGS: '/:word/meanings',
});

export default (server: express.Express, services: Services) => {
	const dictionaryController = new DictionaryController(new DictionaryService(services), services.logger);

	router.get(Endpoints.WORD, dictionaryController.getWord());
	router.get(Endpoints.PART_OF_SPEECH, dictionaryController.getPartOfSpeech());
	router.get(Endpoints.WORD_FORMS, dictionaryController.getWordForms());
	router.get(Endpoints.MEANINGS, dictionaryController.getMeanings());
	router.get('*', function (req, res) {
		res.status(404).json({
			message: 'Not found',
			status: 404,
		});
	});

	server.use('/v1', router);
};
