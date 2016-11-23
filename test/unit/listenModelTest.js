'use strict';

const listenModel = require('../../server/listen/listenModel');

const USER = 'a';
const USER_2 = 'b';
const LISTENED_MUSIC = 'm2';
const LISTENED_MUSIC_2 = 'm3';

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
			return Promise.all([
				listenModel.add(USER, LISTENED_MUSIC),
				listenModel.add(USER, LISTENED_MUSIC_2)
			]).then(() => {
				return expect(listenModel.getMusicByListener(USER)).to.eventually.deep.equal([
					LISTENED_MUSIC, LISTENED_MUSIC_2
				]);
			});
		});

		it('handles duplicates', () => {
			return Promise.all([
				listenModel.add(USER, LISTENED_MUSIC),
				listenModel.add(USER, LISTENED_MUSIC)
			]).then(() => {
				return expect(listenModel.getMusicByListener(USER)).to.eventually.deep.equal([
					LISTENED_MUSIC, LISTENED_MUSIC
				]);
			});
		});
	});

	describe('getMusicByListeners', () => {
		const users = [USER, USER_2];

		it('returns an array when no listens yet', () => {
			return expect(listenModel.getMusicByListeners(users)).to.eventually.be.an('array').and.be.empty;
		});

		it('returns combined array', () => {
			return Promise.all([
				listenModel.add(USER, LISTENED_MUSIC),
				listenModel.add(USER_2, LISTENED_MUSIC_2)
			]).then(() => {
				return expect(listenModel.getMusicByListeners(users)).to.eventually.deep.equal([
					{ user: USER, music: LISTENED_MUSIC },
					{ user: USER_2, music: LISTENED_MUSIC_2 }
				]);
			});
		});
	});
});
