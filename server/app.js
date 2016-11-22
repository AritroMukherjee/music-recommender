'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const bootstrap = require('../script/bootstrap');

const app = express();

app.use(bodyParser.json());
app.use(require('./api'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
	if (err) {
		throw err;
	}

	console.log(`server is running on port ${PORT}`);

	if (process.env.BOOTSTRAP) {
		bootstrap(app);
	}
});

module.exports = app;
