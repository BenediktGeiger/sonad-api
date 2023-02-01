import { buildServices } from '../lib/config/service-locator';
import createServer from '../lib/presentation/http/core/server';
import request from 'supertest';
import e from 'express';

let server: e.Express | null;

beforeEach(async () => {
	process.env.DICTIONARY = 'sonaveeb';
	process.env.LOGGER = 'winston';
	const services = await buildServices();

	server = createServer(services);
});

afterEach(async () => {
	server = null;
});

describe('GET v1/naine', () => {
	it('should return session with media', async () => {
		const response = await request(server).get('/v1/tubli').send();

		const wordforms = {
			singular: {
				nimetav: 'tubli',
				omastav: 'tubli',
				osastav: 'tublit',
			},
			plural: {
				nimetav: 'tublid',
				omastav: 'tublide',
				osastav: 'tublisid',
			},
		};

		expect(response.body.wordForms).toEqual(wordforms);
	});
});
