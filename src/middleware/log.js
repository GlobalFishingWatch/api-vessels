const expressWinston = require('express-winston');
const log = require('../data/log');

module.exports = {
  logger() {
    return expressWinston.logger({ winstonInstance: log });
  },

  errorLogger() {
    return expressWinston.errorLogger({ winstonInstance: log });
  },
};
