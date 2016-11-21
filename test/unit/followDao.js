const followModel = require('../../server/follow/followModel');

describe('followModel', () => {

	beforeEach(() => {
		return followModel.deleteAll();
	});

	describe('add', () => {
		it('another user', () => {
			return followModel.add('a', 'b');
		});

		it('rejects missing follower', () => {
			return expect(followModel.add(null, 'b')).to.be.rejected;
		});

		it('rejects missing followee', () => {
			return expect(followModel.add('a')).to.be.rejected;
		});

		it('rejects following self', () => {
			return expect(followModel.add('a', 'a')).to.be.rejected;
		});

		it('duplicate follow is not counted', () => {
			return Promise.all([
				followModel.add('a', 'b'),
				followModel.add('a', 'b')
			]).then(() => {
				return expect(followModel.getFollowees('a')).to.eventually.have.length(1);
			})
		});
	});

});
