/* 
RPGBot.js

Controls game logic, handles commands, and responds accordingly

*/
const logger = require('winston');

// Parses a command and handles it accordingly
// psid is the user's PSID who sent the command
// command is the command string
var parseCommand = (psid, command) => {
    console.log('Received command: ', command);
    return "I am still under construction! Sorry! :(";
}

module.exports = {
    parseCommand: parseCommand,
}