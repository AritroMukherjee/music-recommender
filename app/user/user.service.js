'use strict';

angular
	.module('user')
	.factory('User', function () {
		let currentUser = 'a'; // hard-coded for now
		return {
			getCurrent: () => currentUser
		};
	});
