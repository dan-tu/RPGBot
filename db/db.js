const sqlite3 = require('sqlite3');
const logger = require('winston');
const sql_commands = require('../gameplay/json/sql_commands');

// Open database connection
let db = new sqlite3.Database('./db/rpgbot.db', (err) => {
    if (err) {
        logger.error(err.message);
    }
    logger.info('Connected to the RPGBot Database');
    db.run(sql_commands.CHECK_DB_EXISTS);
});

module.exports = db;