const elasticsearch = require('../services/elasticsearch');

const transformSearchResult = entry => entry._source;

const calculateNextOffset = (query, results) => (
  query.offset + query.limit <= results.hits.total ?
    query.offset + query.limit :
    null
);

const transformSearchResults = query => results => ({
  query: query.query,
  total: results.hits.total,
  limit: query.limit,
  offset: query.offset,
  nextOffset: calculateNextOffset(query, results),
  entries: results.hits.hits.map(transformSearchResult),
});

module.exports = dataset => ({
  search(query) {
    const elasticSearchQuery = {
      index: dataset.vesselIndex,
      type: 'vessel',
      from: query.offset || 0,
      size: query.limit || 10,
      body: {
        query: {
          query_string: {
            query: `*${query.query}*`,
            allow_leading_wildcard: true,
          },
        },
      },
    };

    return elasticsearch
      .search(elasticSearchQuery)
      .then(transformSearchResults(query));
  },

  get(vesselId) {
    return elasticsearch.get({
        index: dataset.vesselIndex,
        type: 'vessel',
        id: vesselId,
      });
  },
});
