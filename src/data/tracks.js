const sql = require("../services/google/sql");

const featureSettings = {
  times: {
    coordinateProperty: "times",
    property: "timestamp",
    databaseField: "timestamp",
    formatter: value => new Date(value).getTime()
  },
  fishing: {
    coordinateProperty: "scores",
    property: "score",
    databaseField: "score",
    formatter: value => value
  },
  course: {
    coordinateProperty: "courses",
    property: "course",
    databaseField: "course",
    formatter: value => value
  },
  speed: {
    coordinateProperty: "speeds",
    property: "speed",
    databaseField: "speed",
    formatter: value => value
  }
};

module.exports = ({ dataset, additionalFeatures = [] }) => {
  const featureNames = ["times", ...additionalFeatures];
  const features = featureNames.map(name => featureSettings[name]);

  return {
    load(vesselId) {
      const additionalSelectFields = features.map(
        feature => feature.databaseField
      );

      return sql
        .select(
          "seg_id",
          sql.raw('ST_X("position"::geometry) AS "lon"'),
          sql.raw('ST_Y("position"::geometry) AS "lat"'),
          ...additionalSelectFields
        )
        .from(dataset.tracksTable)
        .where("vessel_id", vesselId)
        .orderBy(["seg_id", "timestamp"]);
    },

    formatters: {
      lines(records) {
        const coordinates = records.map(record => [record.lon, record.lat]);

        const coordinateProperties = features.reduce((result, feature) => {
          const value = records.map(record =>
            feature.formatter(record[feature.databaseField])
          );
          return {
            ...result,
            [feature.coordinateProperty]: value
          };
        }, {});

        return {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates
          },
          coordinateProperties
        };
      },

      points(records) {
        const geoJSONFeatures = records.map(record => {
          const properties = features.reduce((result, feature) => {
            const value = feature.formatter(record[feature.databaseField]);
            return {
              ...result,
              [feature.property]: value
            };
          }, {});

          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [record.lon, record.lat]
            },
            properties
          };
        });

        return {
          type: "FeatureCollection",
          features: geoJSONFeatures
        };
      }
    }
  };
};
