'use strict';

const _ = require('lodash');
const debug = require('debug')('recommend:simple');

const listenModel = require('../../listen/listenModel');
const musicModel = require('../../music/musicModel');

const recommender = module.exports = {};

recommender.recommend = function (user, recentRecommendations) {
	return getMusicTagFrequency(user).then(tagFrequency => {
		if (_.isEmpty(tagFrequency)) {
			return Promise.reject(new Error(`simpleTagRecommender: cannot recommend without any listens for user ${user}`));
		}

		return getMusicScores(user, tagFrequency, recentRecommendations).then(musicScores => {
			debug('scores', _.map(_.take(musicScores, 3), JSON.stringify));

			const recommended = _.first(musicScores).music;
			debug('simpleTagRecommender recommended', recommended);
			const commonTags = _.intersection(recommended.tags, _.keys(tagFrequency));
			return {
				'music': recommended.music,
				'explanation': `Because you listen to ${_.first(commonTags)}`
			};
		});
	});
};

function getMusicTagFrequency(user) {
	return listenModel.getMusicByListener(user).then(musicList => {
		var tagPromises = musicList.map(music => musicModel.getTagsForMusic(music));
		return Promise.all(tagPromises).then(tags => {
			tags = _.flatten(tags).sort();
			debug('tags for user %s:', user, tags);
			return _.countBy(tags);
		});
	});
}

function getMusicScores(user, tagFrequency, recentRecommendations) {
	return Promise.all([
		listenModel.getMusicByListener(user).then(musicList => {
			return _.countBy(musicList);
		}),
		musicModel.getAll()
	]).then(values => {
		const [listenedMap, allMusic] = values;
		const newMusic = _.reject(allMusic, musicEntry => {
			const recommendationOverlap = _.includes(recentRecommendations,musicEntry.music);
			const alreadyListened = listenedMap[musicEntry.music];
			return recommendationOverlap || alreadyListened;
		});

		const musicScores = newMusic.map(musicEntry => {
			var score = 0;
			musicEntry.tags.forEach(tag => {
				score += (tagFrequency[tag] || 0);
			});
			return {music: musicEntry, score: score};
		});
		return _.sortBy(musicScores, 'score').reverse();
	});
}

recommender.checkSupported = function (user) {
	// requires at least one music listen
	return listenModel.getMusicByListener(user).then(musicList => {
		return musicList.length;
	});
};
