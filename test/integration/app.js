'use strict';

const _ = require('lodash');
const request = require('supertest');
const debug = require('debug')('recommend:test');

const app = require('../../server/app');
const listenJson = require('../../listen.json');
const followJson = require('../../follows.json');

function postJson(route, json) {
	debug(`POST ${route}: ${JSON.stringify(json)}`);
	return request(app)
		.post(route)
		.send(json)
		.expect(200);
}

function getRecommendation(userId) {
	return request(app)
		.get(`/recommendations?user=${userId}`)
		.expect(200);
}

describe('app', () => {
	function loadMusicListens() {
		return _.flatten(_.map(listenJson.userIds, (musicList, userId) => {
			return _.map(musicList, musicId => ({ userId, musicId }));
		}));
	}

	function loadFollows() {
		return followJson.operations.map(value => ({ from: value[0], to: value[1] }));
	}

	// as specified in script.md
	it('can bootstrap and recommend', () => {
		const listenPosts = loadMusicListens().map(listen => postJson('/listen', listen));
		const followPosts = loadFollows().map(follow => postJson('/follow', follow));

		return Promise.all([...listenPosts, ...followPosts]).then(() => {
			const user = 'a';
			return getRecommendation(user).expect((res) => {
				console.log(`recommendations for user ${user}: ${JSON.stringify(res.body, null, 2)}`);
				return expect(res.body.list).to.have.length(5);
			});
		});
	});

	describe('/listen', () => {
		it('POST succeeds', () => {
			return request(app)
				.post('/listen')
				.send({ userId: 'a', musicId: 'm2' })
				.expect(200);
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

	describe('/follow', () => {
		it('POST succeeds', () => {
			return request(app)
				.post('/follow')
				.send({ from: 'a', to: 'b' })
				.expect(200);
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

	describe('/recommendations', () => {
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
});
