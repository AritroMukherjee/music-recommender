'use strict';

const listenModel = require('../../server/listen/listenModel');

const USER = 'a';
const LISTENED_MUSIC = 'm2';

describe('listenModel', () => {
	afterEach(() => {
		return listenModel.deleteAll();
	});

	describe('add', () => {
		it('adds music to listener', () => {
			return listenModel.add(USER, LISTENED_MUSIC);
		});

		it('rejects missing user', () => {
			return expect(listenModel.add(null, LISTENED_MUSIC)).to.be.rejected;
		});

		it('rejects missing music', () => {
			return expect(listenModel.add(USER)).to.be.rejected;
		});
	});

	describe('getMusicByListener', () => {
		it('returns an array when no listens yet', () => {
			return expect(listenModel.getMusicByListener(USER)).to.eventually.be.an('array').and.be.empty;
		});

		it('returns in order', () => {
			const nextMusic = 'b';

			return Promise.all([
				listenModel.add(USER, LISTENED_MUSIC),
				listenModel.add(USER, nextMusic)
			]).then(() => {
				return expect(listenModel.getMusicByListener(USER)).to.eventually.deep.equal([LISTENED_MUSIC, nextMusic]);
			});
		});

		it('handles duplicates', () => {
			return Promise.all([
				listenModel.add(USER, LISTENED_MUSIC),
				listenModel.add(USER, LISTENED_MUSIC)
			]).then(() => {
				return expect(listenModel.getMusicByListener(USER)).to.eventually.deep.equal([LISTENED_MUSIC, LISTENED_MUSIC]);
			});
		});
	});
});
