'use strict';

const request = require('supertest');

const app = require('../../server/app');

describe('/follow', () => {
	it('POST succeeds', () => {
		return request(app)
			.post('/follow')
			.send({ from: 'a', to: 'b' })
			.expect(201);
	});

	it('handles no parameters', () => {
		return request(app)
			.post('/follow')
			.expect(400);
	});

	it('handles no `to` parameter', () => {
		return request(app)
			.post('/follow')
			.send({ from: 'a' })
			.expect(400);
	});
});
