import express from 'express';
import DictionaryController from '@lib/presentation/http/controllers/dictionaryController';
import DictionaryService from '@lib/application/dictionary-service';
import { Services } from '@lib/config/service-locator';
import { sanitizer } from '@lib/presentation/http/middlewares/index';
import { register } from '@lib/presentation/http/prom';

const router = express.Router();

const Endpoints = Object.freeze({
	WORD: '/:word',
	PART_OF_SPEECH: '/:word/partofspeech',
	WORD_FORMS: '/:word/wordforms',
	MEANINGS: '/:word/meanings',
	METRICS: '/metrics',
});

export default (server: express.Express, services: Services) => {
	const dictionaryController = new DictionaryController(new DictionaryService(services), services.logger);

	router.get(Endpoints.WORD, sanitizer, dictionaryController.getWord());
	router.get(Endpoints.PART_OF_SPEECH, sanitizer, dictionaryController.getPartOfSpeech());
	router.get(Endpoints.WORD_FORMS, sanitizer, dictionaryController.getWordForms());
	router.get(Endpoints.MEANINGS, sanitizer, dictionaryController.getMeanings());
	router.get('*', function (req, res) {
		res.status(404).json({
			message: 'Not found',
			status: 404,
		});
	});

	server.use(Endpoints.METRICS, async function (req, res) {
		res.setHeader('Content-type', register.contentType);
		res.end(await register.metrics());
	});

	server.use('/v1', router);
};
