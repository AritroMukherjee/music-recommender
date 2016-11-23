'use strict';

const request = require('supertest');

const app = require('../../server/app');

describe('/listen', () => {
	it('POST succeeds', () => {
		return request(app)
			.post('/listen')
			.send({ userId: 'a', musicId: 'm2' })
			.expect(201);
	});

	it('handles no parameters', () => {
		return request(app)
			.post('/listen')
			.expect(400);
	});

	it('handles no `user` parameter', () => {
		return request(app)
			.post('/listen')
			.send({ musicId: 'm2' })
			.expect(400);
	});
});
