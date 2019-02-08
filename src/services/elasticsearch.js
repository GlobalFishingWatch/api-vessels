const config = require('../config');
const { Client } = require('elasticsearch');

module.exports = new Client({
  host: config.elasticsearch.server,
})
