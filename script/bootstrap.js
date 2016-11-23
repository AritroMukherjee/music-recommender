'use strict';

const _ = require('lodash');
const request = require('supertest');
const debug = require('debug')('recommend:bootstrap');

const listenJson = require('../data/listen.json');
const followJson = require('../data/follows.json');

function loadMusicListens() {
	return _.flatten(_.map(listenJson.userIds, (musicList, userId) => {
		return _.map(musicList, musicId => ({ userId, musicId }));
	}));
}

function loadFollows() {
	return followJson.operations.map(value => ({ from: value[0], to: value[1] }));
}

function postJson(app, route, json) {
	debug(`POST ${route}: ${JSON.stringify(json)}`);
	return request(app)
		.post(route)
		.send(json)
		.expect(201);
}

module.exports = function bootstrap(app) {
	const listenPosts = loadMusicListens().map(listen => postJson(app, '/listen', listen));
	const followPosts = loadFollows().map(follow => postJson(app, '/follow', follow));

	return Promise.all([...listenPosts, ...followPosts]);
};
