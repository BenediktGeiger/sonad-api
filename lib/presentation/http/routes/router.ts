import express from 'express';
import DictionaryController from '@lib/presentation/http/controllers/dictionaryController';
import DictionaryService from '@lib/application/dictionary-service';
import { Services } from '@lib/config/service-locator';

const router = express.Router();

const Endpoints = Object.freeze({
	WORD: '/:word',
});

export default (server: express.Express, services: Services) => {
	const dictionaryController = new DictionaryController(new DictionaryService(services), services.logger);

	router.get(Endpoints.WORD, dictionaryController.getWord());

	server.use('/v1', router);
};
