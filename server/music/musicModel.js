'use strict';

const _ = require('lodash');

const musicModel = module.exports = {};

const music = require('../../data/music.json');

// TODO: introduce Music class to avoid passing around literals
// music will still a map with id as the key

musicModel.getMusicCount = function () {
	return Promise.resolve(Object.keys(music).length);
};

musicModel.getAll = function () {
	return Promise.resolve(_.map(music, (tags, musicId) => ({ tags, music: musicId })));
};

musicModel.getTagsForMusic = function (musicId) {
	if (music[musicId] === undefined) {
		return Promise.reject(new Error(`no music found with id ${musicId}`));
	}

	return Promise.resolve(music[musicId] || []);
};
