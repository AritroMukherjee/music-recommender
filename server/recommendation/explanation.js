'use strict';

module.exports = {
	tag: type => `tag-${type}`, // `Because you listen to <tag>`
	popular: () => 'popular', // `Popular right now`
	follow: user => `follow-${user}` // `Listened to by <user>`
};
