const logger = require('winston');
const request = require('request');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const RPGBot = require('../gameplay/RPGBot');

module.exports = (req, res) => {
    let body = req.body;

    if (body.object == 'page') {
        body.entry.forEach((entry) => {
            let webhook_event = entry.messaging[0];
            let sender_psid = webhook_event.sender.id;

            logger.info('Received event from ' + sender_psid);

            // Check event type
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        res.status(200).send("EVENT_RECEIVED");
    } else {
        logger.error('Received an event that is unhandled!')
        res.sendStatus(404);
    }
};

// Handlers
function handleMessage (sender_psid, received_message) {
    let response;

    if (received_message.text) {
        response = {
            "text" : RPGBot.parseCommand(sender_psid, received_message.text)
        }
    }
    sendResponse(sender_psid, response);
}

function handlePostback (sender_psid, received_postback) {
    logger.warn('Postbacks not implemented yet');
    sendResponse(sender_psid, "I can't handle postbacks yet!");
}

// Sends response back to the user
function sendResponse (sender_psid, response) {
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
            logger.info('Message sent to ' + sender_psid + ': ' + response.text);
        } else {
            logger.error('Unable to send message:' + err);
        }
    })
}