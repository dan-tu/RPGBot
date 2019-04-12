/* 
RPGBot.js

Controls game logic and handles commands and responses
*/
const logger = require('winston');
const sendResponse = require('../controllers/responseController');
const { handleRegistration, checkUserRegistered } = require('./handlers/registrationHandler');

// Parses a command and handles it accordingly
// psid is the user's PSID who sent the command
// command is the message sent by the user
let parseCommand = (psid, commands) => {
    logger.info('Parsing "' + commands + '" from PSID: ' + psid);
    let args_arr = commands.toLowerCase().split(" ");
    let command = args_arr[0];
    let args = args_arr.slice(1, args_arr.length);
    let response;

    // Three commands not required to be registered to use: help, register, and commands
    switch (command) {
        case 'help':
            sendResponse(getHelp(args));
            return;
        case 'register':
            handleRegistration(psid, args);
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

    // Block users from using any commands that require them to be registered
    checkUserRegistered(psid, null, )
    sendResponse(psid, response);
}

module.exports = {
    parseCommand: parseCommand,
}