'use strict';

const sinon = require('sinon');

const listenModel = require('../../server/listen/listenModel');
const recommender = require('../../server/recommendation/recommender/popularRecommender');

let sandbox;

describe('popularRecommender', () => {
	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});

	afterEach(() => sandbox.restore());

	it('recommends music based on popularity', () => {
		sandbox.stub(listenModel, 'getAll', () => Promise.resolve([
			{ music: 'm1' }, { music: 'm4' }, { music: 'm4' }, { music: 'm3' }
		]));

		return recommender.recommend('a').then((result) => {
			return expect(result.music).to.equal('m4');
		});
	});

	it('includes an explanation', () => {
		sandbox.stub(listenModel, 'getAll', () => Promise.resolve([
			{ music: 'm1' }
		]));

		return recommender.recommend('a').then((result) => {
			return expect(result.explanation).to.equal('popular');
		});
	});

	it('will not recommend music already heard', () => {
		sandbox.stub(listenModel, 'getAll', () => Promise.resolve([
			{ user: 'a', music: 'm1' },
			{ user: 'e', music: 'm4' }, // current user
			{ user: 'e', music: 'm4' }, // current user
			{ user: 'b', music: 'm3' }
		]));

		return recommender.recommend('e').then((result) => {
			expect(result.music).to.not.equal('m4'); // would be selected, except already listened
			expect(result.music).to.equal('m1');
		});
	});

	it('returns null if no recommendation possible', () => {
		sandbox.stub(listenModel, 'getAll', () => Promise.resolve([
			{ user: 'a', music: 'm1' }
		]));

		return expect(recommender.recommend('a', ['m1'])).to.eventually.equal(null);
	});
});
