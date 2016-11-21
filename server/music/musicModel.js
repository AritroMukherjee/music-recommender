const _ = require('lodash');

const musicModel = module.exports = {};

const music = require('../../music.json');

musicModel.getMusicCount = function () {
	return Promise.resolve(Object.keys(music).length);
};

musicModel.getAll = function () {
	return Promise.resolve(_.map(music, (tags, music) => {
		return { music, tags };
	}));
};

musicModel.getTagsForMusic = function (musicId) {
	if (music[musicId] === undefined) {
		return Promise.reject(`no music found with id ${musicId}`);
	}

	return Promise.resolve(music[musicId] || []);
};
