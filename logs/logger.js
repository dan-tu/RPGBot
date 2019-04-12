const logger = require('winston');

// Create log files for errors and general logging
logger.add(new logger.transports.File({ filename: "./logs/combined.log" }));
logger.add(new logger.transports.File({ filename: "./logs/errors.log", level : 'error' }));

// For debugging/developing purposes
if (process.env.NODE_ENV !== 'production') {
    logger.add(new logger.transports.Console({
        format: logger.format.combine(
            logger.format.colorize(),
            logger.format.simple()
        )
    }));
}

module.exports = logger;