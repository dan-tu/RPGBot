/* 
RPGBot.js

Controls game logic, handles commands, and responds accordingly

*/
const logger = require('winston');
const helpText = require('./helpText.json');

// Parses a command and handles it accordingly
// psid is the user's PSID who sent the command
// command is the command string
var parseCommand = (psid, command) => {
    logger.info('Parsing "' + command + '" from PSID: ' + psid);
    var args_arr = command.toLowerCase().split(" ");
    var command = args_arr[0];
    var args = args_arr.slice(1, args_arr.length);

    switch (command) {
        case 'help':
            return getHelp(args);
        case 'register':
            return handleRegistration(args);
        case 'commands':
            return "I can't do that yet!"
        case 'show':
            return "I can't do that yet!"
        case 'fight':
            return "I can't do that yet!"
        default:
            return "I did not recognize that command. For help, send me 'help'";
    }
}

// Provides a help string depending on which arguments were provided
// args is the arguments after 'Help <args>'
const getHelp = (args) => {
    if (args.length === 0) {
        return helpText.noargs;
    } else {
        // switch (args[0]) {
        return "I can't help you with that command!"
        // }
    }
}

// Creates a new database entry for this user with starting information and desired username
const handleRegistration = (psid) => {

}

module.exports = {
    parseCommand: parseCommand,
}