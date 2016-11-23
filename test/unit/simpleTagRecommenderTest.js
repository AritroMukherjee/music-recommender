'use strict';

const sinon = require('sinon');

const listenModel = require('../../server/listen/listenModel');
const recommender = require('../../server/recommendation/recommender/simpleTagRecommender');

let sandbox;

describe('simpleTagRecommender', () => {
	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});

	afterEach(() => sandbox.restore());

	it('recommends music based on tags', () => {
		sandbox.stub(listenModel, 'getMusicByListener', () => Promise.resolve(['m2']));
		// m2 has ["samba", "60s"]

		return recommender.recommend('a').then((result) => {
			return expect(result.music).to.equal('m11'); // m11 also has samba
		});
	});

	it('includes an explanation', () => {
		sandbox.stub(listenModel, 'getMusicByListener', () => Promise.resolve(['m2']));

		return recommender.recommend('a').then((result) => {
			return expect(result.explanation).to.equal('tag-samba');
		});
	});

	it('rejects if no listened music', () => {
		sandbox.stub(listenModel, 'getMusicByListener', () => Promise.resolve([]));

		return expect(recommender.recommend('a')).to.be.rejectedWith(/cannot recommend without any listens/);
	});

	it('returns null if no recommendation possible', () => {
		sandbox.stub(listenModel, 'getMusicByListener', () => Promise.resolve(['m11']));

		return expect(recommender.recommend('e', ['m2'])).to.eventually.equal(null);
	});

	it('will not recommend music already heard', () => {
		sandbox.stub(listenModel, 'getMusicByListener', () => Promise.resolve(['m2', 'm11']));

		return recommender.recommend('e').then((result) => {
			expect(result.music).to.not.equal('m11'); // would be selected, except already listened
			expect(result.music).to.equal('m10'); // tagged 60s, like m2
		});
	});
});
