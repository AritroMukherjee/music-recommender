'use strict';

const _ = require('lodash');
const request = require('supertest');

const app = require('../../server/app');
const helper = require('./testHelper');

describe('/recommendations', () => {
	before(() => helper.bootstrap(app));

	it('returns recommendations for a user', () => {
		return getRecommendation('a').expect((res) => {
			return expect(res.body.list).to.have.length(5);
		});
	});

	it('returns different recommendations each time', () => {
		return getRecommendation('a').expect((res) => {
			const uniqueMusicIds = _.uniq(_.map(res.body.list, 'music'));
			return expect(uniqueMusicIds).to.have.length(5);
		});
	});

	it('handles unknown user', () => {
		return request(app)
			.get('/recommendations?user=foo')
			.expect(500); // TODO: should properly be a 404
	});

	it('handles no user parameter', () => {
		return request(app)
			.get('/recommendations')
			.expect(400);
	});
});

function getRecommendation(userId) {
	return request(app)
		.get(`/recommendations?user=${userId}`)
		.expect(200);
}
