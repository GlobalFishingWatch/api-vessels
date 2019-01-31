const { BigQuery } = require('@google-cloud/bigquery');
const config = require('../config');

module.exports = new BigQuery(config.gcloud.bigquery);
