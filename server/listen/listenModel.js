'use strict';

const Listen = require('./listen');

const listenModel = module.exports = {};

const listenerToMusic = new Map(); // specified as array, but we may want a Set
const musicToListeners = new Map(); // Set probably

const listens = [];

listenModel.add = function (userId, musicId) {
	if (!userId) {
		return Promise.reject(new Error('no user specified for listen'));
	}
	// NOTE-DZH: would normally validate user exists here

	if (!musicId) {
		return Promise.reject(new Error('no music specified for listen'));
	}

	// TODO: is maintaining these worth it?
	initMapEntry(listenerToMusic, userId);
	listenerToMusic.get(userId).push(musicId);

	initMapEntry(musicToListeners, userId);
	musicToListeners.get(userId).push(userId);

	const listen = new Listen(userId, musicId);
	listens.push(listen);

	return Promise.resolve(listen);
};

listenModel.getMusicByListener = function (userId) {
	return Promise.resolve(listenerToMusic.get(userId) || []);
};

listenModel.getListenersByMusic = function (musicId) {
	return Promise.resolve(musicToListeners.get(musicId) || []);
};

listenModel.getAll = function () {
	return Promise.resolve(listens);
};

listenModel.deleteAll = function () {
	listenerToMusic.clear();
	musicToListeners.clear();

	return Promise.resolve();
};

function initMapEntry(map, key) {
	if (!map.has(key)) {
		map.set(key, []);
	}
}
