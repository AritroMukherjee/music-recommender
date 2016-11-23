'use strict';

const sinon = require('sinon');

const followModel = require('../../server/follow/followModel');
const listenModel = require('../../server/listen/listenModel');
const recommender = require('../../server/recommendation/recommender/followRecommender');

let sandbox;

describe('followRecommender', () => {
	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});

	afterEach(() => sandbox.restore());

	const musicByListeners = [{ user: 'b', music: 'm20' }];

	it('recommends music based on follows', () => {
		sandbox.stub(listenModel, 'getMusicByListeners', () => Promise.resolve(musicByListeners));

		return recommender.recommend('a').then((result) => {
			return expect(result.music).to.equal('m20');
		});
	});

	it('includes an explanation', () => {
		sandbox.stub(listenModel, 'getMusicByListeners', () => Promise.resolve(musicByListeners));

		return recommender.recommend('a').then((result) => {
			return expect(result.explanation).to.equal('follow-b');
		});
	});

	it('returns null if followees have no listens', () => {
		sandbox.stub(listenModel, 'getMusicByListeners', () => Promise.resolve([]));
		sandbox.stub(followModel, 'getFollowees', () => Promise.resolve(['b', 'c']));

		return expect(recommender.recommend('a')).to.eventually.equal(null);
	});

	it('returns null if followees have no new listens', () => {
		sandbox.stub(listenModel, 'getMusicByListeners', () => Promise.resolve(musicByListeners));
		sandbox.stub(followModel, 'getFollowees', () => Promise.resolve(['b', 'c']));

		return expect(recommender.recommend('a', ['m20'])).to.eventually.equal(null);
	});

	it('will not recommend music already heard', () => {
		sandbox.stub(listenModel, 'getMusicByListener', () => Promise.resolve(['m2']));
		sandbox.stub(listenModel, 'getMusicByListeners', () => Promise.resolve([
			{ user: 'b', music: 'm2' },
			{ user: 'c', music: 'm5' }
		]));

		return recommender.recommend('a').then((result) => {
			return expect(result.music).to.equal('m5'); // already heard m2
		});
	});
});
