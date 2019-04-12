// Checks if user is already registered.
// If not, adds the user to the database.
const logger = require('winston');
const db = require('../../db/db');
const sendResponse = require('../../controllers/responseController');
const sql_commands = require('../json/sql_commands');

// Checks if the user's PSID is registered.
// If it is, calls the exists function
// If not, calls the does not exist (dne) function
// If checking the database fails, calls fail
let checkUserRegistered = (psid, userExists, userDNE, fail) => {
    let user_exists_query = sql_commands.CHECK_USER_EXISTS;
    db.all(user_exists_query, [psid], (err, rows) => {
        if (err) {
            logger.error("Failed to check database for existing user: " + err);
            fail();
            return;
        }
        // Check query results for existing user
        if (rows.length !== 0 && rows[0].psid == psid) {
            userExists();
        } else {
            userDNE();
        } 
    });
}

// Handles the register command
let handleRegistration = (psid, args) => {
    // Check for correct usage
    if (args.length !== 1) {
        sendResponse(psid, "Please use *Register <Username>* to register. Usernames may not have any spaces in them.");
        return;
    }

    let username = args[0];
    let fail_query = () => { sendResponse(psid, "I couldn't do what you wanted! Please try again in a few minutes.") };

    let handleUserExists = () => {
        sendResponse(psid, "You are already registered with the name *" + username + "*");
    }

    // Adds a new user with a given username
    // Only called when user uses register command
    let registerUser = () => {
        let add_user = sql_commands.REGISTER_NEW_USER;
        db.run(add_user, [psid, username], (err) => {
            if (err) {
                logger.error("Error adding new player to database: " + err);
                sendResponse(psid, "I couldn't do what you wanted! Please try again in a few minutes.");
                return;
            }
            logger.info("New user registered: PSID " + psid + " -> " + username);
            fail_query();
    });
}

    checkUserRegistered(psid, handleUserExists, registerUser, fail_query);
}

module.exports = {
    handleRegistration: handleRegistration,
    checkUserRegistered: checkUserRegistered
}



