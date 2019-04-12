'use strict';
const logger = require('./logs/logger.js');
const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json());

// Express listening to port 3000 for any requests
const PORT = 3000;
app.listen(PORT, () => logger.info('Webhook listening to port: ', PORT));

// Webhook endpoint
const messageHandler = require('./controllers/messageHandler');
app.post('/webhook', messageHandler);

// Webhook verification and subscribing
const webhookVerification = require('./controllers/webhookVerification');
app.get('/webhook', webhookVerification);
