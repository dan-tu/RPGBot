'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json());
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const request = require('request');

// Express listening to port 3000 for any requests
const PORT = 3000;
app.listen(PORT, () => console.log('Webhook is listening on port: ', PORT));

// Webhook endpoint
app.post('/webhook', (req, res) => {

    let body = req.body;

    if (body.object == 'page') {
        body.entry.forEach((entry) => {
            let webhook_event = entry.messaging[0];
            // TODO: Move debugging logs
            console.log(webhook_event);

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

// Verifies webhook with messenger api using VERIFY_TOKEN
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
            console.log('webhook verified');
            res.status(200).send(challenge);
        } else {
            // Send back forbidden status if tokens do not match
            res.sendStatus(403);
        }
    } 
});

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
