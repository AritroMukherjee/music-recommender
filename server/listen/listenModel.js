'use strict';

const _ = require('lodash');
const Listen = require('./listen');

const listenModel = module.exports = {};

const listenerToMusic = new Map(); // specified as array, but we may want a Set

const listens = [];

listenModel.add = function (userId, musicId) {
	if (!userId) {
		return Promise.reject(new Error('no user specified for listen'));
	}
	// NOTE-DZH: would normally validate user exists here

	if (!musicId) {
		return Promise.reject(new Error('no music specified for listen'));
	}

	const listen = new Listen(userId, musicId);
	listens.push(listen);

	initMapEntry(listenerToMusic, userId);
	listenerToMusic.get(userId).push(musicId);

	return Promise.resolve(listen);
};

listenModel.getMusicByListener = function (userId) {
	return Promise.resolve(listenerToMusic.get(userId) || []);
};

listenModel.getMusicByListeners = function (userIds) {
	const results = userIds.map((userId) => {
		const musicIds = listenerToMusic.get(userId) || [];
		return musicIds.map(musicId => ({ user: userId, music: musicId }));
	});
	return Promise.resolve(_.flatten(results));
};

listenModel.getAll = function () {
	return Promise.resolve(listens);
};

listenModel.getCount = function () {
	return Promise.resolve(listens.length);
};

listenModel.deleteAll = function () {
	listenerToMusic.clear();
	listens.length = 0;
	return Promise.resolve();
};

function initMapEntry(map, key) {
	if (!map.has(key)) {
		map.set(key, []);
	}
}
