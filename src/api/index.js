const yaml = require('yamljs');
const config = require('../config');

const spec = yaml.load('./src/api/index.yaml');
spec.schemes = [config.server.protocol];

module.exports = spec;
