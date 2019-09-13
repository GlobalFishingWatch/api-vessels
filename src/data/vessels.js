/* eslint-disable no-underscore-dangle */
const elasticsearch = require("../services/elasticsearch");
const log = require("./log");

const transformSearchResult = source => entry => {
  const baseFields = source.tileset
    ? { tilesetId: source.tileset }
    : { dataset: source.dataset.name };

  return {
    id: entry._id,
    ...entry._source,
    ...baseFields
  };
};

const calculateNextOffset = (query, results) =>
  query.offset + query.limit <= results.hits.total
    ? query.offset + query.limit
    : null;

const transformSearchResults = ({ query, source }) => results => ({
  query: query.query,
  total: results.hits.total,
  limit: query.limit,
  offset: query.offset,
  nextOffset: calculateNextOffset(query, results),
  entries: results.hits.hits.map(transformSearchResult(source))
});

module.exports = source => {
  const index = source.dataset
    ? source.dataset.vesselIndex
    : source.tileset.toLowerCase();

  log.debug(`Searching in elasticsearch index ${index}`);

  return {
    search(query) {
      const elasticSearchQuery = {
        index,
        from: query.offset || 0,
        size: query.limit || 10,
        body: {
          query: {
            query_string: {
              query: `*${query.query}*`,
              allow_leading_wildcard: true,
              ...(query.queryFields && { fields: query.queryFields })
            }
          }
        }
      };

      return elasticsearch
        .search(elasticSearchQuery)
        .then(transformSearchResults({ query, source }));
    },

    get(vesselId) {
      const identity = {
        index,
        type: "vessel",
        id: vesselId
      };
      return elasticsearch.get(identity).then(transformSearchResult(source));
    }
  };
};
