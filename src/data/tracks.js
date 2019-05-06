const concat = require("lodash/fp/concat");
const filter = require("lodash/fp/filter");
const flatMap = require("lodash/fp/flatMap");
const flow = require("lodash/fp/flow");
const identity = require("lodash/fp/identity");
const isEmpty = require("lodash/fp/isEmpty");
const map = require("lodash/fp/map");
const reduce = require("lodash/fp/reduce");
const zipAll = require("lodash/fp/zipAll");
const sql = require("../services/google/sql");
const log = require("../data/log");

const baseCoordinateProperties = times => ({
  times: map(date => new Date(date).getTime())(times)
});

const buildAdditionalFeature = options => ({
  extraFields: options.extraFields,
  concatCoordinateProperties:
    options.concatCoordinateProperties || (() => identity),
  extractAdditionalGeoJSONFeatures:
    options.extractAdditionalGeoJSONFeatures || (() => [])
});

const additionalFeaturesByName = {
  fishing: buildAdditionalFeature({
    extraFields: ["scores"],
    extractAdditionalGeoJSONFeatures: segments => {
      const timedCoordinates = flatMap(segment =>
        flow(
          zipAll,
          filter(([score]) => score > 0.5),
          map(([, time, coordinate]) => [time, coordinate])
        )([segment.scores, segment.times, segment.geojson.coordinates])
      )(segments);

      if (isEmpty(timedCoordinates)) {
        return [];
      }

      const times = map(([time]) => time)(timedCoordinates);
      const coordinates = map(([, coordinate]) => coordinate)(timedCoordinates);

      return [
        {
          type: "Feature",
          properties: {
            type: "fishing",
            coordinateProperties: baseCoordinateProperties(times)
          },
          geometry: {
            type: "MultiPoint",
            coordinates
          }
        }
      ];
    }
  }),

  course: buildAdditionalFeature({
    extraFields: ["courses"],
    concatCoordinateProperties: segment => coordinateProperties => ({
      courses: segment.courses,
      ...coordinateProperties
    })
  }),

  speed: buildAdditionalFeature({
    extraFields: ["speeds"],
    concatCoordinateProperties: segment => coordinateProperties => ({
      speeds: segment.speeds,
      ...coordinateProperties
    })
  })
};

const segmentToGeoJSONTrackFeature = additionalFeatures => segment => {
  const geometry = segment.geojson;
  if (geometry.coordinates.length > 1) {
    geometry.type = "LineString";
  }

  const coordinateProperties = reduce((result, feature) =>
    feature.concatCoordinateProperties(segment)(result)
  )(baseCoordinateProperties(segment.times))(additionalFeatures);

  return {
    type: "Feature",
    properties: {
      id: segment.id,
      type: "track",
      coordinateProperties
    },
    geometry
  };
};

const queryResultsToGeoJSON = (segments, additionalFeatures) => {
  log.debug("Query results available, converting to GeoJSON");
  const features = concat(
    map(segmentToGeoJSONTrackFeature(additionalFeatures))(segments),
    flatMap(feature => feature.extractAdditionalGeoJSONFeatures(segments))(
      additionalFeatures
    )
  );

  return {
    type: "FeatureCollection",
    features
  };
};

const parseSegmentGeoJSON = segment => ({
  ...segment,
  geojson: JSON.parse(segment.geojson)
});

module.exports = dataset => ({
  forVessel(vesselId, additionalFeatureNames = []) {
    log.debug(
      `Looking up track for vessel ${vesselId} including features ${additionalFeatureNames}`
    );
    const additionalFeatures = map(name => additionalFeaturesByName[name])(
      additionalFeatureNames
    );

    const query = sql
      .select(
        "tracks.seg_id as id",
        "times",
        sql.raw('ST_AsGeoJSON("seg_geography") as "geojson"'),
        ...flatMap(feature => feature.extraFields)(additionalFeatures)
      )
      .from({ tracks: dataset.tracksTable })
      .innerJoin(
        { vessels: dataset.vesselsTable },
        "tracks.seg_id",
        "vessels.seg_id"
      )
      .where("vessels.vessel_id", vesselId);

    return query
      .then(segments => map(parseSegmentGeoJSON)(segments))
      .then(segments => queryResultsToGeoJSON(segments, additionalFeatures));
  }
});
