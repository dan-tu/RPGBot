'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json());
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const request = require('request');
const logger = require('./logs/logger.js');

// Express listening to port 3000 for any requests
const PORT = 3000;
app.listen(PORT, () => logger.info('Webhook listening to port: ', PORT));

// Webhook endpoint
app.post('/webhook', (req, res) => {

    let body = req.body;

    if (body.object == 'page') {
        body.entry.forEach((entry) => {
            let webhook_event = entry.messaging[0];
            logger.debug('Webhook event received');

            let sender_psid = webhook_event.sender.id;
            // Check event type
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        res.status(200).send("EVENT_RECEIVED");
    } else {
        res.sendStatus(404);
    }
});

// Verifies webhook with messenger api
const webhookVerification = require('./controllers/webhookVerification');
app.get('/webhook', webhookVerification);

// Handlers
function handleMessage (sender_psid, received_message) {
    let response;

    if (received_message.text) {
        response = {
            "text" : "Thank you for your message."
        }
    }

    // Send a response message
    callSendAPI(sender_psid, response);
}

function handlePostback (sender_psid, received_postback) {
    let response;

    // Handle postbacks for different events here
}

// Sends response
function callSendAPI (sender_psid, response) {
    let req_body = {
        "recipient" : {
            "id" : sender_psid
        },
        "message" : response
    }

    request({
        "messaging_type" : "RESPONSE",
        "uri" : "https://graph.facebook.com/v3.2/me/messages",
        "qs" : {
            "access_token" : PAGE_ACCESS_TOKEN
        },
        "method" : "POST",
        "json" : req_body
    }, (err, res, body) => {
        if (!err) {
            console.log('Message sent to ', sender_psid, ': ', response.text);
        } else {
            console.error('Unable to send message:' + err);
        }
    })
}
