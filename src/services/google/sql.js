const Knex = require("knex");
const config = require("../../config");

module.exports = new Knex({
  client: "pg",
  connection: {
    user: config.gcloud.sql.user,
    password: config.gcloud.sql.password,
    database: config.gcloud.sql.db,
    host: `/cloudsql/${config.gcloud.sql.instance}`
  },
  debug: true
});
