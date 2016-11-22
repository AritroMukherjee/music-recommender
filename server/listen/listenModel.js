'use strict';

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

listenModel.getAll = function () {
	return Promise.resolve(listens);
};

listenModel.deleteAll = function () {
	listenerToMusic.clear();
	return Promise.resolve();
};

function initMapEntry(map, key) {
	if (!map.has(key)) {
		map.set(key, []);
	}
}
