'use strict';

const listenModel = module.exports = {};

const listenerToMusic = new Map(); // specified as array, but we may want a Set
const musicToListeners = new Map(); // Set probably

listenModel.add = function (userId, musicId) {
	if (!userId) {
		return Promise.reject(new Error('no user specified for listen'));
	}
	// NOTE-DZH: would normally validate user exists here

	if (!musicId) {
		return Promise.reject(new Error('no music specified for listen'));
	}

	initMapEntry(listenerToMusic, userId);
	listenerToMusic.get(userId).push(musicId);

	initMapEntry(musicToListeners, userId);
	musicToListeners.get(userId).push(userId);

	// TODO: create listen object and return it
	return Promise.resolve();
};

listenModel.getMusicByListener = function (userId) {
	return Promise.resolve(listenerToMusic.get(userId) || []);
};

listenModel.getListenersByMusic = function (musicId) {
	return Promise.resolve(musicToListeners.get(musicId) || []);
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
