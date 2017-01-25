'use strict';

angular
	.module('user')
	.factory('User', () => {
		const currentUser = 'a'; // hard-coded for now
		return {
			getCurrent: () => currentUser
		};
	});
