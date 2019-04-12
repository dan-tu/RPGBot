/* 
RPGBot.js

Controls game logic and handles commands and responses
*/
const logger = require('winston');
const sendResponse = require('../controllers/responseController');

// Parses a command and handles it accordingly
// psid is the user's PSID who sent the command
// command is the message sent by the user
let parseCommand = (psid, commands) => {
    logger.info('Parsing "' + commands + '" from PSID: ' + psid);
    let args_arr = commands.toLowerCase().split(" ");
    let command = args_arr[0];
    let args = args_arr.slice(1, args_arr.length);
    let response;

    switch (command) {
        case 'help':
            response = getHelp(args);
            break;
        case 'register':
            const registrationHandler = require('./handlers/registrationHandler.js');
            registrationHandler(psid, args);
            return;
        case 'commands':
            response = "I can't do that yet!"
        case 'show':
            response = "I can't do that yet!"
        case 'fight':
            response = "I can't do that yet!"
        default:
            response = "I did not recognize that command. For help, send me *help*. For a list of commands, use *commands*.";
    }

    sendResponse(psid, response);
}

module.exports = {
    parseCommand: parseCommand,
}