const logger = require('winston');
const request = require('request');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const RPGBot = require('../gameplay/RPGBot');

module.exports = (req, res) => {
    let body = req.body;

    if (body.object == 'page') {
        body.entry.forEach((entry) => {
            let webhook_event = entry.messaging[0];
            console.log('Received event');

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
        logger.error('')
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
            "access_token" : "EAAHZCe2cBVR0BAPYufu0t1VxrZBKGYuyAx6vkhmZCdDWC8GaYwzBKZB7NudEi16il2IxX0DAaaU6FZCMHKRbFdv0MuxALebGw9YUU1et8GVul2n8kmrZBamh2opPoIu8o6VayzgfwDNwVlB9C5famGTO1gOLSYIVcYu5FtorKAJAZDZD"
        },
        "method" : "POST",
        "json" : req_body
    }, (err, res, body) => {
        if (!err) {
            console.log('Message sent to ', sender_psid, ': ', response);
        } else {
            console.error('Unable to send message:' + err);
        }
    })
}