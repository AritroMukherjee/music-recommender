'use strict';

const _ = require('lodash');

const musicModel = require('../../server/music/musicModel');

describe('musicModel', () => {
	it('initializes with music', () => {
		return expect(musicModel.getMusicCount()).to.eventually.be.greaterThan(0);
	});

	describe('getAll', () => {
		it('returns all', () => {
			return musicModel.getAll().then((music) => {
				expect(music).to.have.length(12);

				const sampleMusic = _.first(music);
				expect(sampleMusic).to.have.property('tags');
				expect(sampleMusic).to.have.property('id');
			});
		});
	});

	describe('getTagsForMusic', () => {
		it('returns all tags', () => {
			return expect(musicModel.getTagsForMusic('m1')).to.eventually.eql(['jazz', 'old school', 'instrumental']);
		});

		it('rejects non-existent id', () => {
			return expect(musicModel.getTagsForMusic('foo')).to.be.rejected;
		});
	});
});
