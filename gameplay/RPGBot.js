/* 
RPGBot.js

Controls game logic, handles commands, and responds accordingly

*/
const logger = require('winston');
const helpText = require('./helpers/helpText.json');
const sqlite3 = require('sqlite3');
const request = require('request');
const sql_commands = require('./helpers/sql_commands')
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Open database
let db = new sqlite3.Database('./db/rpgbot.db', (err) => {
    if (err) {
        logger.error(err.message);
    }
    logger.info('Connected to the RPGBot Database');
    db.run(sql_commands.CHECK_DB_EXISTS);
});

// Parses a command and handles it accordingly
// psid is the user's PSID who sent the command
// command is the command string
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

    sendResponse(psid, response);
}

// Provides a help string depending on which arguments were provided
// args is the arguments after 'Help <args>'
// Returns the help string
let getHelp = (args) => {
    if (args.length === 0) {
        return helpText.noargs;
    } else {
        // switch (args[0]) {
        return "I can't help you with that command!"
        // }
    }
}

// Creates a new database entry for this user with starting information and desired username
let handleRegistration = (psid, args) => {
    if (args.length !== 1) {
        sendResponse(psid, "Please use *Register <Username>* to register. Usernames may not have any spaces in them.");
        return;
    }

    // See if user already exists in database
    let user_exists_query = sql_commands.CHECK_USER_EXISTS;
    db.all(user_exists_query, [psid], (err, rows) => {
        if (err) {
            logger.error("Error checking database for existing user: " + err);
            sendResponse(psid, "I couldn't make an account for you. Please try again in a few minutes.");
            return;
        }

        // Should technically only have one row since psid is a primary key
        if (rows.length !== 0) {
            if (rows[0].psid == psid) {
                logger.info("User tried to register but was already registered: " + psid);
                sendResponse(psid, ("You are already registered with the username: *" + rows[0].ign + "*"));
            }
        } else {
            // There are no entries for that PSID, register a new user
            let add_user = sql_commands.REGISTER_NEW_USER;
            db.run(add_user, [psid, args[0]], (err) => {
                if (err) {
                    logger.error("Error adding new player to database: " + err);
                    sendResponse(psid, "I couldn't make an account for you. Please try again in a few minutes.");
                    return;
                }
                sendResponse(psid, "You are now registered under the username *" + args[0] + "*. Enjoy the game!");
            });
        }
    });
}

// Sends response back to the user
function sendResponse (sender_psid, response) {
    let req_body = {
        "recipient" : {
            "id" : sender_psid
        },
        "message" : { "text" : response }
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
            logger.info('Message sent to ' + sender_psid + ': ' + response);
        } else {
            logger.error('Unable to send message:' + err);
        }
    })
}

module.exports = {
    parseCommand: parseCommand,
}