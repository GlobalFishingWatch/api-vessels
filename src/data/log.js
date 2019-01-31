const winston = require('winston');
const config = require('../config');

module.exports = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple(),
      ),
    }),
  ],
  level: config.log.level,
});
