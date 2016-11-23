'use strict';

const express = require('express');

const router = express.Router();

const listenModel = require('./listen/listenModel');
const followModel = require('./follow/followModel');
const recommenderService = require('./recommendation/recommenderService');

router.get('/', (req, res) => {
	res.sendStatus(200);
});

router.post('/listen', (req, res, next) => {
	const { userId, musicId } = req.body;
	if (!userId) {
		return handleMissingInput(res, 'Missing `userId` in body of request');
	}
	if (!musicId) {
		return handleMissingInput(res, 'Missing `musicId` in body of request');
	}

	listenModel.add(userId, musicId)
		.then(() => res.sendStatus(201))
		.catch(makeErrorHandler(next));
});

router.delete('/listen', (req, res, next) => {
	listenModel.deleteAll()
		.then(() => res.sendStatus(204))
		.catch(makeErrorHandler(next));
});

router.post('/follow', (req, res, next) => {
	const { from, to } = req.body;
	if (!from) {
		return handleMissingInput(res, 'Missing `from` in body of request');
	}
	if (!to) {
		return handleMissingInput(res, 'Missing `to` in body of request');
	}

	followModel.add(from, to)
		.then(() => res.sendStatus(201))
		.catch(makeErrorHandler(next));
});

router.delete('/follow', (req, res, next) => {
	followModel.deleteAll()
		.then(() => res.sendStatus(204))
		.catch(makeErrorHandler(next));
});

router.get('/recommendations', (req, res, next) => {
	const user = req.query.user;
	if (!user) {
		return handleMissingInput(res, 'Missing `user` query parameter');
	}
	const options = {
		count: req.query.count
	};

	recommenderService.recommend(user, options)
		.then(recommendations => res.json(recommendations))
		.catch(makeErrorHandler(next));
});

function handleMissingInput(res, message) {
	res.status(400).send(message);
}

function makeErrorHandler(next) {
	return function (error) {
		console.error(error.stack);
		return next(error); // the express default error handler suffices for now
	};
}

module.exports = router;
