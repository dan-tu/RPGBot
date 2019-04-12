// Provides a help string depending on which arguments were provided
// args is the arguments after 'Help <args>'
// Returns the help string
const helpText = require('../json/helpText.json');

module.exports = (args) => {
    if (args.length === 0) {
        return helpText.noargs;
    } else {
        // switch (args[0]) {
        return "I can't help you with that command!"
        // }
    }
}