'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json());

// Express listening to port 3000 for any requests
const PORT = 3000;
app.listen(PORT, () => console.log('Webhook is listening...'));

// Webhook endpoint
app.post('/webhook', (req, res) => {

    let body = req.body;

    if (body.object == 'page') {
        body.entry.forEach((entry) => {
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

app.get('/webhook', (req, res) => {
    let VERIFY_TOKEN = "HorsesEatCarrots";

    // Parse the query parameters
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Makes sure mode and token exist
    if (mode && token) {
        // Mode and token are correct, return the challenge token
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        }
    } else {
        // Send back forbidden status if tokens do not match
        res.sendStatus(403);
    }
});