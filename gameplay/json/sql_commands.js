module.exports = {
    "CHECK_DB_EXISTS" : "CREATE TABLE IF NOT EXISTS players (psid text primary key, username text, level int, exp int, max_hp, int, damage int, defense int)",
    "CHECK_USER_EXISTS" : "SELECT * FROM players WHERE psid = (?)",
    "REGISTER_NEW_USER" : "NSERT INTO players VALUES ((?), (?), 1, 0, 10, 5, 5)",
};