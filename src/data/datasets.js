const datastore = require('../services/google/datastore');

const datasetKind = 'Dataset';

module.exports = {
  fullyQualifiedId(id) {
    const parts = id.split(':');

    if (parts.length === 1) {
      parts.push('latest');
    }

    return parts.join(':');
  },

  list() {
    const query = datastore.createQuery(datasetKind);
    return datastore.runQuery(query);
  },

  get(id) {
    const actualId = this.fullyQualifiedId(id);
    const key = datastore.key([datasetKind, actualId]);
    return datastore
      .get(key)
      .then(dataset => dataset[0]);
  },
};
