'use strict';

const _ = require('lodash');
const debug = require('debug')('recommend:popular');

const listenModel = require('../../listen/listenModel');
const explanation = require('../explanation');

const recommender = module.exports = {};

recommender.checkSupported = function () {
	// no prerequisites; good for new users
	return true;
};

recommender.recommend = function (user, recentRecommendations) {
	const popularityMap = {};
	return listenModel.getAll().then((allListens) => {
		const max = { count: 0, music: null };
		_.each(allListens, (listen) => {
			const alreadyListened = listen.user === user;
			const recommendationOverlap = _.includes(recentRecommendations, listen.music);
			if (alreadyListened || recommendationOverlap) {
				return;
			}

			popularityMap[listen.music] = 1 + (popularityMap[listen.music] || 0);

			if (popularityMap[listen.music] > max.count) {
				max.count = popularityMap[listen.music];
				max.music = listen.music;
			}
		});
		debug('popularity map', popularityMap);

		debug('popularRecommender recommended', max.music);
		return {
			music: max.music,
			explanation: explanation.popular()
		};
	});
};
