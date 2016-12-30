'use strict';

const _ = require('lodash');
const request = require('supertest');

const app = require('../../server/app');
const bootstrap = require('./bootstrap');

describe('/recommendations', () => {
	before(() => bootstrap(app));

	it('returns recommendations for a user', () => {
		return getRecommendation('a').expect((res) => {
			return expect(res.body.list).to.have.length(5);
		});
	});

	it('returns recommendations even for new user without any listens', () => {
		return getRecommendation('z').expect((res) => {
			return expect(res.body.list).to.have.length(5);
		});
	});

	it('returns specified number of recommendations', () => {
		return request(app)
			.get('/recommendations?user=a&count=3')
			.expect(200)
			.expect((res) => {
				return expect(res.body.list).to.have.length(3);
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
			expect(uniqueExplanations).to.have.length.greaterThan(1);
			expect(uniqueExplanations).to.include('popular');
		});
	});

	it('handles no user parameter', () => {
		return request(app)
			.get('/recommendations')
			.expect(400);
	});

	// NOTE: order matters here
	it('fails to recommend without any listens loaded', () => {
		request(app)
			.delete('/listen')
			.expect(200)
			.end(() => {
				return request(app)
					.get('/recommendations?user=a')
					.expect(500);
			});
	});
});

function getRecommendation(userId) {
	return request(app)
		.get(`/recommendations?user=${userId}`)
		.expect(200);
}
