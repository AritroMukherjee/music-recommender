'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('app'));
app.use(bodyParser.json());
app.use(require('./api'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`);
});

module.exports = app;
