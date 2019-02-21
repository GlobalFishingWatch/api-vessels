const expressWinston = require('express-winston');
const log = require('../data/log');

module.exports = {
  logger() {
    return expressWinston.logger({
      winstonInstance: log,
      ignoreRoute(req) {
        return req.path.startsWith('/_ah/');
      },

    });
  },

  errorLogger() {
    return expressWinston.errorLogger({ winstonInstance: log });
  },
};
