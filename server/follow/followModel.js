'use strict';

const Follow = require('./follow');

const followModel = module.exports = {};

const followsMap = new Map();

followModel.add = function (followerId, followeeId) {
	if (!followerId) {
		return Promise.reject(new Error('no follower specified for follow'));
	}
	if (!followeeId) {
		return Promise.reject(new Error('no followee specified for follow'));
	}
	if (followerId === followeeId) {
		return Promise.reject(new Error(`user ${followerId} cannot follow self`));
	}
	// NOTE-DZH: would normally validate users exist here

	initMapEntry(followsMap, followerId);

	const follow = new Follow(followerId, followeeId);

	const followees = followsMap.get(followerId);
	// equality comparison of objects didn't make it in ES6 :(
	const alreadyExists = Array.from(followees).some(followee => follow.equals(followee));
	if (!alreadyExists) {
		followees.add(follow);
	}

	return Promise.resolve(follow);
};

followModel.getFollowees = function (followerId) {
	if (!followerId) {
		return Promise.reject(new Error('no follower specified'));
	}

	const followeeSet = followsMap.get(followerId) || [];
	return Promise.resolve(Array.from(followeeSet));
};

followModel.deleteAll = function () {
	followsMap.clear();
	return Promise.resolve();
};

function initMapEntry(map, key) {
	if (!map.has(key)) {
		map.set(key, new Set());
	}
}

function init() {
	const followJson = require('../../data/follows.json'); // eslint-disable-line global-require
	return Promise.all(followJson.operations.map(value => followModel.add(value[0], value[1])));
}

if (process.env.BOOTSTRAP) {
	init();
}
