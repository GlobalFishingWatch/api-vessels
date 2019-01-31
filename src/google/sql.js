const Knex = require('knex');
const config = require('../config');

module.exports = new Knex({
  client: 'pg',
  connection: config.gcloud.sql.connectionString,
  debug: true,
});
