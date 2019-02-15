const { Client } = require('elasticsearch');
const config = require('../config');

module.exports = new Client({
  host: config.elasticsearch.server,
});
