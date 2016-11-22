'use strict';

const _ = require('lodash');
const Music = require('./music');

const musicMap = new Map();

function init() {
	const musicJson = require('../../data/music.json'); // eslint-disable-line global-require
	_.each(musicJson, (tags, musicId) =>
		musicMap.set(musicId, new Music(musicId, tags))
	);
}

init();

const musicModel = module.exports = {};

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
