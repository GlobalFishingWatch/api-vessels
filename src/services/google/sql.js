const Knex = require("knex");
const config = require("../../config");
const log = require("../../data/log");

module.exports = new Knex({
  client: "pg",
  connection: {
    user: config.gcloud.sql.user,
    password: config.gcloud.sql.password,
    database: config.gcloud.sql.db,
    host: `/cloudsql/${config.gcloud.sql.instance}`
  },
  debug: true,
  log: {
    warn(message) {
      log.warn(message);
    },
    error(message) {
      log.error(message);
    },
    deprecate(message) {
      log.warn(message);
    },
    debug(message) {
      log.debug(message);
    }
  }
});
