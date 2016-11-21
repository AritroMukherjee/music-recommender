const debug = require('debug')('recommend');
const _ = require('lodash');

const simpleTagRecommender = require('./recommender/simpleTagRecommender');

const recommenderService = module.exports = {};

const recommenders = [
	// TODO: additional recommenders
	simpleTagRecommender
];

recommenderService.recommend = function (user, options = {}) {
	const recommendationCount = options.count || 5;

	const supportedRecommenders = recommenders.filter(recommender => recommender.checkSupported(user));
	if (!supportedRecommenders.length) {
		return Promise.reject(`no valid recommenders for user ${user}`);
	}

	return recommendNext(0, recommendationCount, user, supportedRecommenders).then(recommendations => {
		return {
			list: recommendations
		};
	});
};

function recommendNext(counter, total, user, recommenders, recommendations = []) {
	if (counter > 5 * total) {
		// sanity check
		return Promise.reject(new Error(`too many attempts to recommend for user ${user}: ${counter}`));
	}

	const nextRecommender = recommenders[counter % recommenders.length];
	return nextRecommender.recommend(user, _.map(recommendations, 'music')).then(function(recommendation) {
		recommendations.push(recommendation);
		debug('recommended so far', recommendations.length);
		return recommendations.length < total ? recommendNext(++counter, total, user, recommenders, recommendations) : recommendations;
	})
}
