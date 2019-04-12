// Handles verification of our webhook with the Messenger API
const logger = require('winston');

module.exports = (req, res) => {
    let VERIFY_TOKEN = "HorsesEatCarrots";

    // Parse the query parameters
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Makes sure mode and token exist
    if (mode && token) {
        // Mode and token are correct, return the challenge token
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            logger.info('Successfully subscribed to webhook');
            res.status(200).send(challenge);
        } else {
            // Send back forbidden status if tokens do not match
            logger.error('Failed to subscribe to webhook');
            res.sendStatus(403);
        }
    } 
};