'use strict';

const request = require('supertest');

const app = require('../../server/app');
const helper = require('./testHelper');

const user = 'a';

describe('app', () => {
	it('can bootstrap and recommend', () => {
		// as specified in script.md
		return helper.bootstrap(app).then(() => {
			return request(app)
				.get(`/recommendations?user=${user}`)
				.expect(200)
				.expect((res) => {
					console.log(`recommendations for user ${user}: ${JSON.stringify(res.body, null, 2)}`);
					return expect(res.body.list).to.have.length(5);
				});
		});
	});
});

