'use strict';

const debug = require('debug')('recommend');
const _ = require('lodash');

const simpleTagRecommender = require('./recommender/simpleTagRecommender');
const popularRecommender = require('./recommender/popularRecommender');

const recommenderService = module.exports = {};

const availableRecommenders = [
	simpleTagRecommender,
	popularRecommender
	// lots more possible:
	// followerRecommender: 'listened to by x'
	// similarUserRecommender: 'people who liked x also liked y'
];

recommenderService.recommend = function (user, options = {}) {
	const recommendationCount = options.count || 5;

	return getSupportedRecommenders(user).then((supportedRecommenders) => {
		if (!supportedRecommenders.length) {
			return Promise.reject(new Error(`no valid recommenders for user ${user}`));
		}

		return recommendNext(0, recommendationCount, user, supportedRecommenders)
			.then(recommendations => ({ list: recommendations }));
	});
};

function getSupportedRecommenders(user) {
	const checkPromises = availableRecommenders.map(recommender => recommender.checkSupported(user));
	return Promise.all(checkPromises).then((checkResults) => {
		return availableRecommenders.filter((recommender, index) => {
			return checkResults[index]; // true if supported
		});
	});
}

function recommendNext(counter, total, user, recommenders, recommendations = []) {
	if (counter > 5 * total) {
		// sanity check
		return Promise.reject(new Error(`too many attempts to recommend for user ${user}: ${counter}`));
	}

	const nextRecommender = recommenders[counter % recommenders.length];
	return nextRecommender.recommend(user, _.map(recommendations, 'music')).then((recommendation) => {
		recommendations.push(recommendation);
		debug('recommended so far', recommendations.length);
		return recommendations.length < total ?
			recommendNext(counter + 1, total, user, recommenders, recommendations) :
			recommendations;
	});
}
