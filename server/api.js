const express = require('express');
const router = express.Router();

const listenModel = require('./listen/listenModel');
const followModel = require('./follow/followModel');
const recommenderService = require('./recommendation/recommenderService');

router.get('/', function (req, res) {
	res.sendStatus(200);
});

router.post('/listen', function (req, res) {
	const {userId, musicId} = req.body;
	if (!userId) {
		return handleMissingInput(res, 'Missing `userId` in body of request');
	}
	if (!musicId) {
		return handleMissingInput(res, 'Missing `musicId` in body of request');
	}

	listenModel.add(userId, musicId)
		.then(() => res.sendStatus(200))
		.catch(makeErrorHandler(res));
});

router.post('/follow', function (req, res) {
	const {from, to} = req.body;
	if (!from) {
		return handleMissingInput(res, 'Missing `from` in body of request');
	}
	if (!to) {
		return handleMissingInput(res, 'Missing `to` in body of request');
	}

	followModel.add(from, to)
		.then(() => res.sendStatus(200))
		.catch(makeErrorHandler(res));
});

router.get('/recommendations', function (req, res) {
	const user = req.query.user;
	if (!user) {
		return handleMissingInput(res, 'Missing `user` query parameter');
	}

	recommenderService.recommend(user)
		.then(recommendations => res.json(recommendations))
		.catch(makeErrorHandler(res));
});

function handleMissingInput(res, message) {
	res.status(400).send(message);
}

function makeErrorHandler(res) {
	return function (error) {
		console.error(error.stack);
		// TODO: vary status based on kind of error
		res.sendStatus(500);
	}
}

module.exports = router;
