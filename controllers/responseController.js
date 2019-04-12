// Sends response to PSID
const request = require('request');
const logger = require('winston');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

module.exports = (sender_psid, response) => {
    let req_body = {
        "messaging_type" : "RESPONSE",
        "recipient" : {
            "id" : sender_psid
        },
        "message" : { "text" : response }
    }

    request({
        "uri" : "https://graph.facebook.com/v3.2/me/messages",
        "qs" : {
            "access_token" : PAGE_ACCESS_TOKEN
        },
        "method" : "POST",
        "json" : req_body
    }, (err, res, body) => {
        if (!err) {
            logger.info('Message sent to ' + sender_psid + ': ' + response);
        } else {
            logger.error('Unable to send message:' + err);
        }
    })
}