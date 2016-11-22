'use strict';

const _ = require('lodash');
const debug = require('debug')('recommend:popular');

const listenModel = require('../../listen/listenModel');
const explanation = require('../explanation');

const recommender = module.exports = {};

recommender.checkSupported = function () {
	// only requires that listen data (for any user) is available
	return listenModel.getCount().then(count => count > 0);
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
		if (!max.music) {
			return null;
		}

		debug('popularRecommender recommended', max.music);
		return {
			music: max.music,
			explanation: explanation.popular()
		};
	});
};
