const groupBy = require("lodash/fp/groupBy");
const sql = require("../services/google/sql");

const extractCoordinates = records => {
  return records.map(record => [record.lon, record.lat]);
};

const extractCoordinateProperties = (features, records) => {
  return features.reduce((result, feature) => {
    if (!feature.coordinateProperty) {
      return result;
    }
    const value = records.map(record =>
      feature.formatter(record[feature.databaseField])
    );
    return {
      ...result,
      [feature.coordinateProperty]: value
    };
  }, {});
};

const featureSettings = {
  times: {
    generateGeoJSONFeatures: () => [],
    coordinateProperty: "times",
    property: "timestamp",
    databaseField: "timestamp",
    formatter: value => new Date(value).getTime()
  },
  fishing: {
    generateGeoJSONFeatures: (features, records) => {
      const fishingRecords = records.filter(record => record.score > 0);
      const coordinates = extractCoordinates(fishingRecords);
      const coordinateProperties = extractCoordinateProperties(
        features,
        fishingRecords
      );

      return [
        {
          type: "Feature",
          properties: {
            type: "fishing",
            coordinateProperties
          },
          geometry: {
            type: "MultiPoint",
            coordinates
          }
        }
      ];
    },
    property: "fishing",
    databaseField: "score",
    formatter: value => value > 0
  },
  course: {
    generateGeoJSONFeatures: () => [],
    coordinateProperty: "courses",
    property: "course",
    databaseField: "course",
    formatter: value => value
  },
  speed: {
    generateGeoJSONFeatures: () => [],
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
        const segments = groupBy(record => record.seg_id)(records);

        const trackGeoJSONFeatures = Object.entries(segments).map(
          ([segment, segmentRecords]) => {
            const coordinates = extractCoordinates(segmentRecords);
            const coordinateProperties = extractCoordinateProperties(
              features,
              segmentRecords
            );

            return {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates
              },
              properties: {
                type: "track",
                segId: segment,
                coordinateProperties
              }
            };
          }
        );

        const additioanlGeoJSONFeatures = features.reduce((result, feature) => {
          return result.concat(
            feature.generateGeoJSONFeatures(features, records)
          );
        }, []);

        return {
          type: "FeatureCollection",
          features: [...trackGeoJSONFeatures, ...additioanlGeoJSONFeatures]
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
            properties: {
              segId: record.seg_id,
              ...properties
            }
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
