'use strict';

const _ = require('lodash');
const request = require('supertest');

const app = require('../../server/app');
const helper = require('./testHelper');

describe('/recommendations', () => {
	it('returns recommendations even for new user', () => {
		return getRecommendation('a').expect((res) => {
			return expect(res.body.list).to.have.length(5);
		});
	});

	describe('with data loaded', () => {
		before(() => helper.bootstrap(app));

		it('returns recommendations for a user', () => {
			return getRecommendation('a').expect((res) => {
				return expect(res.body.list).to.have.length(5);
			});
		});

		it('returns unique recommendations each time', () => {
			return getRecommendation('a').expect((res) => {
				const uniqueMusicIds = _.uniq(_.map(res.body.list, 'music'));
				return expect(uniqueMusicIds).to.have.length(5);
			});
		});

		it('returns recommendations from multiple recommenders', () => {
			return getRecommendation('a').expect((res) => {
				const uniqueExplanations = _.uniq(_.map(res.body.list, 'explanation'));
				return expect(uniqueExplanations).to.have.length.greaterThan(1);
				return expect(uniqueExplanations).to.include('popular');
			});
		});

		it('handles no user parameter', () => {
			return request(app)
				.get('/recommendations')
				.expect(400);
		});
	});
});

function getRecommendation(userId) {
	return request(app)
		.get(`/recommendations?user=${userId}`)
		.expect(200);
}
