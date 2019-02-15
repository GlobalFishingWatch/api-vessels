const constant = require('lodash/fp/constant');
const filter = require('lodash/fp/filter');
const flatMap = require('lodash/fp/flatMap');
const flow = require('lodash/fp/flow');
const identity = require('lodash/fp/identity');
const isEmpty = require('lodash/fp/isEmpty');
const map = require('lodash/fp/map');
const reduce = require('lodash/fp/reduce');
const reject = require('lodash/fp/reject');
const zip = require('lodash/fp/zip');
const sql = require('../services/google/sql');
const log = require('../data/log');

const defaultAdditionalFeatureSettings = field => ({
  extraFields: field,
  updateCoordinateProperties: segment => coordinateProperties => ({
    [field]: segment.field,
    ...coordinateProperties,
  }),
  buildExtraGeoJSONFeatures: constant([]),
});

const additionalFeatureSettings = {
  fishing: {
    extraFields: 'scores',
    updateCoordinateProperties: () => identity,
    buildExtraGeoJSONFeatures: (segment) => {
      const coordinates = flow(
        zip(segment.scores),
        filter(([score]) => score > 0.5),
        map(([, coordinate]) => coordinate),
      )(segment.geojson.coordinates);

      if (isEmpty(coordinates)) {
        return {};
      }

      return {
        type: 'Feature',
        properties: {
          track: segment.id,
          type: 'fishing',
        },
        geometry: {
          type: 'MultiPoint',
          coordinates,
        },
      };
    },
  },

  course: defaultAdditionalFeatureSettings('courses'),

  speed: defaultAdditionalFeatureSettings('speeds'),
};

const segmentToGeoJSONTrack = (segment, extraFeatures = []) => {
  const geometry = segment.geojson;
  if (geometry.coordinates.length > 1) {
    geometry.type = 'LineString';
  }

  const baseCoordinateProperties = {
    times: map(date => new Date(date).getTime())(segment.times),
  };

  const coordinatePropertiesReducer = (result, feature) => (
    feature.updateCoordinateProperties(segment)(result)
  );

  const reduceCoordinateProperties = reduce(coordinatePropertiesReducer)(baseCoordinateProperties);

  const coordinateProperties = reduceCoordinateProperties(extraFeatures);

  return {
    type: 'Feature',
    properties: {
      id: segment.id,
      type: 'track',
      coordinateProperties,
    },
    geometry,
  };
};

const queryResultsToGeoJSON = (segments, extraFeatures) => {
  log.debug('Query results available, converting to GeoJSON');
  const features = flow(
    map(segment => ({
      ...segment,
      geojson: JSON.parse(segment.geojson),
    })),
    flatMap(segment => [
      segmentToGeoJSONTrack(segment, extraFeatures),
      ...map(feature => feature.buildExtraGeoJSONFeatures(segment))(extraFeatures),
    ]),
    reject(isEmpty),
  )(segments);

  return {
    type: 'FeatureCollection',
    features,
  };
};

module.exports = dataset => ({
  forVessel(vesselId, additionalFeatures = []) {
    log.debug(`Looking up track for vessel ${vesselId} including features ${additionalFeatures}`);
    const extraFeatures = map(feature => additionalFeatureSettings[feature])(additionalFeatures);

    const query = sql
      .select(
        'tracks.seg_id as id',
        'times',
        sql.raw('ST_AsGeoJSON("seg_geography") as "geojson"'),
        ...extraFeatures.map(feature => feature.extraFields),
      )
      .from({ tracks: dataset.tracksTable })
      .innerJoin({ vessels: dataset.vesselsTable }, 'tracks.seg_id', 'vessels.seg_id')
      .where('vessels.vessel_id', vesselId);

    return query.then(segments => queryResultsToGeoJSON(segments, extraFeatures));
  },
});
