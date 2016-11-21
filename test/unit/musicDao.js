const musicModel = require('../../server/music/musicModel');

describe('musicModel', () => {

	it('initializes with music', () => {
		return expect(musicModel.getMusicCount()).to.eventually.be.greaterThan(0);
	});

	describe('getAll', () => {
		it('returns all', () => {
			return expect(musicModel.getAll()).to.eventually.have.length(12);
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
