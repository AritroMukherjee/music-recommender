'use strict';

const _ = require('lodash');
const debug = require('debug')('recommend:simple');

const listenModel = require('../../listen/listenModel');
const musicModel = require('../../music/musicModel');
const explanation = require('../explanation');

const recommender = module.exports = {};

recommender.checkSupported = function (user) {
	// requires at least one music listen
	return listenModel.getMusicByListener(user).then(musicList => musicList.length);
};

recommender.recommend = function (user, recentRecommendations) {
	return getMusicTagFrequency(user).then((tagFrequency) => {
		if (_.isEmpty(tagFrequency)) {
			return Promise.reject(new Error(`simpleTagRecommender: cannot recommend without any listens for user ${user}`));
		}

		return getMusicScores(user, tagFrequency, recentRecommendations).then((musicScores) => {
			debug('scores', _.map(_.take(musicScores, 3), JSON.stringify));

			const recommended = _.first(musicScores).music;
			debug('simpleTagRecommender recommended', recommended);
			const commonTags = _.intersection(recommended.tags, _.keys(tagFrequency));
			return {
				music: recommended.id,
				explanation: explanation.tag(_.first(commonTags))
			};
		});
	});
};

function getMusicTagFrequency(user) {
	return listenModel.getMusicByListener(user).then((musicList) => {
		const tagPromises = musicList.map(music => musicModel.getTagsForMusic(music));
		return Promise.all(tagPromises).then((tags) => {
			const sortedTags = _.flatten(tags).sort();
			debug('tags for user %s:', user, sortedTags);
			return _.countBy(sortedTags);
		});
	});
}

function getMusicScores(user, tagFrequency, recentRecommendations) {
	return Promise.all([
		listenModel.getMusicByListener(user).then(musicList => _.countBy(musicList)),
		musicModel.getAll()
	]).then((values) => {
		const [listenedMap, allMusic] = values;
		const newMusic = _.reject(allMusic, (music) => {
			const recommendationOverlap = _.includes(recentRecommendations, music.id);
			const alreadyListened = listenedMap[music.id];
			return recommendationOverlap || alreadyListened;
		});

		const musicScores = newMusic.map((music) => {
			let score = 0;
			music.tags.forEach((tag) => {
				score += (tagFrequency[tag] || 0);
			});
			return { score, music };
		});
		return _.sortBy(musicScores, 'score').reverse();
	});
}
