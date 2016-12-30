'use strict';

const _ = require('lodash');
const Music = require('./music');

const musicMap = new Map();

const musicModel = module.exports = {};

musicModel.add = function (musicId, tags) {
	return Promise.resolve(musicMap.set(musicId, new Music(musicId, tags)));
};

musicModel.getMusicCount = function () {
	return Promise.resolve(musicMap.size);
};

musicModel.getAll = function () {
	return Promise.resolve(Array.from(musicMap.values()));
};

musicModel.getTagsForMusic = function (musicId) {
	if (!musicMap.has(musicId)) {
		return Promise.reject(new Error(`no music found with id ${musicId}`));
	}

	return Promise.resolve(musicMap.get(musicId).tags || []);
};

function init() {
	const musicJson = require('../../data/music.json'); // eslint-disable-line global-require
	return Promise.all(_.map(musicJson, (tags, musicId) => musicModel.add(musicId, tags)));
}

init(); // not dependent on BOOTSTRAP because music is not based on user activity
