// Checks if user is already registered.
// If not, adds the user to the database.
const logger = require('winston');
const db = require('../../db/db');

module.exports = (psid, args) => {
    if (args.length !== 1) {
        sendResponse(psid, "Please use *Register <Username>* to register. Usernames may not have any spaces in them.");
        return;
    }

    // See if user is already registered
    let user_exists_query = sql_commands.CHECK_USER_EXISTS;
    db.all(user_exists_query, [psid], (err, rows) => {
        if (err) {
            logger.error("Error checking database for existing user: " + err);
            sendResponse(psid, "I couldn't make an account for you. Please try again in a few minutes.");
            return;
        }

        // If user already exists in our DB
        if (rows.length !== 0 && rows[0].psid == psid) {
            sendResponse(psid, ("You are already registered with the username: *" + rows[0].ign + "*"));
        } else {
            // There are no entries for that PSID, register a new user
            let add_user = sql_commands.REGISTER_NEW_USER;
            db.run(add_user, [psid, args[0]], (err) => {
                if (err) {
                    logger.error("Error adding new player to database: " + err);
                    sendResponse(psid, "I couldn't make an account for you. Please try again in a few minutes.");
                    return;
                }
                logger.info("New user registered. PSID: " + psid + " -> " + args[0]);
                sendResponse(psid, "You are now registered under the username *" + args[0] + "*. Enjoy the game!");
            });
        }
    });
}