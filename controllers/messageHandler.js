const logger = require('winston');
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
                RPGBot.parseCommand(sender_psid, webhook_event.message.text);
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


function handlePostback (sender_psid, received_postback) {
    logger.warn('Postbacks not implemented yet');
}

