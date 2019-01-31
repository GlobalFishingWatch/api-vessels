const Datastore = require('@google-cloud/datastore');
const config = require('../config');

module.exports = new Datastore(config.gcloud.datastore);
