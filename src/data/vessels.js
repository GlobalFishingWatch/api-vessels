const elasticsearch = require("../services/elasticsearch");
const log = require("./log");

// eslint-disable-next-line no-underscore-dangle
const transformSearchResult = entry => entry._source;

const calculateNextOffset = (query, results) =>
  query.offset + query.limit <= results.hits.total
    ? query.offset + query.limit
    : null;

const transformSearchResults = query => results => ({
  query: query.query,
  total: results.hits.total,
  limit: query.limit,
  offset: query.offset,
  nextOffset: calculateNextOffset(query, results),
  entries: results.hits.hits.map(transformSearchResult)
});

module.exports = datasets => {
  const indices = datasets.map(dataset => dataset.vesselIndex).join(",");

  log.debug(`Using elasticsearch indices ${indices}`);

  return {
    search(query) {
      const elasticSearchQuery = {
        index: indices,
        type: "vessel",
        from: query.offset || 0,
        size: query.limit || 10,
        body: {
          query: {
            query_string: {
              query: `*${query.query}*`,
              allow_leading_wildcard: true
            }
          }
        }
      };

      return elasticsearch
        .search(elasticSearchQuery)
        .then(transformSearchResults(query));
    },

    get(vesselId) {
      const identity = {
        index: indices,
        type: "vessel",
        id: vesselId
      };
      return elasticsearch.get(identity).then(transformSearchResult);
    }
  };
};
