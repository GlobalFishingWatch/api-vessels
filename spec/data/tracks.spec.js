const { expect } = require("chai");
const tracks = require("../../src/data/tracks");

describe("data/tracks", () => {
  describe("formatters", () => {
    describe("lines", () => {
      it("returns valid geojson when no additional features are set", () => {
        const records = [
          {
            seg_id: "seg1",
            lon: 100,
            lat: 60,
            timestamp: "2019-01-01T00:00:00.000Z"
          },
          {
            seg_id: "seg1",
            lon: 100,
            lat: 61,
            timestamp: "2019-01-01T01:00:00.000Z"
          },
          {
            seg_id: "seg2",
            lon: 101,
            lat: 60,
            timestamp: "2019-01-01T00:00:00.000Z"
          }
        ];

        const result = tracks({ additionalFeatures: [] }).formatters.lines(
          records
        );

        expect(result).to.deep.equal({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [[100, 60], [100, 61]]
              },
              properties: {
                coordinateProperties: {
                  times: [1546300800000, 1546304400000]
                },
                type: "track",
                segId: "seg1"
              }
            },

            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [[101, 60]]
              },
              properties: {
                coordinateProperties: {
                  times: [1546300800000]
                },
                type: "track",
                segId: "seg2"
              }
            }
          ]
        });
      });

      it("returns valid geojson when additional features are set", () => {
        const records = [
          {
            seg_id: "seg1",
            lon: 100,
            lat: 60,
            timestamp: "2019-01-01T00:00:00.000Z",
            score: 1,
            course: 10,
            speed: 100
          },
          {
            seg_id: "seg1",
            lon: 100,
            lat: 61,
            timestamp: "2019-01-01T01:00:00.000Z",
            score: 0,
            course: 20,
            speed: 200
          },
          {
            seg_id: "seg2",
            lon: 101,
            lat: 60,
            timestamp: "2019-01-01T00:00:00.000Z",
            score: 1,
            course: 30,
            speed: 300
          }
        ];

        const result = tracks({
          additionalFeatures: ["fishing", "speed", "course"]
        }).formatters.lines(records);

        expect(result).to.deep.equal({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [[100, 60], [100, 61]]
              },
              properties: {
                coordinateProperties: {
                  times: [1546300800000, 1546304400000],
                  courses: [10, 20],
                  speeds: [100, 200]
                },
                type: "track",
                segId: "seg1"
              }
            },
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [[101, 60]]
              },
              properties: {
                coordinateProperties: {
                  times: [1546300800000],
                  courses: [30],
                  speeds: [300]
                },
                type: "track",
                segId: "seg2"
              }
            },
            {
              type: "Feature",
              geometry: {
                type: "MultiPoint",
                coordinates: [[100, 60], [101, 60]]
              },
              properties: {
                type: "fishing",
                coordinateProperties: {
                  times: [1546300800000, 1546300800000],
                  courses: [10, 30],
                  speeds: [100, 300]
                }
              }
            }
          ]
        });
      });
    });

    describe("points", () => {
      it("returns valid geojson when no additional features are set", () => {
        const records = [
          {
            seg_id: "seg1",
            lon: 100,
            lat: 60,
            timestamp: "2019-01-01T00:00:00.000Z"
          },
          {
            seg_id: "seg1",
            lon: 100,
            lat: 61,
            timestamp: "2019-01-01T01:00:00.000Z"
          },
          {
            seg_id: "seg2",
            lon: 101,
            lat: 60,
            timestamp: "2019-01-01T00:00:00.000Z"
          }
        ];

        const result = tracks({ additionalFeatures: [] }).formatters.points(
          records
        );

        expect(result).to.deep.equal({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: { type: "Point", coordinates: [100, 60] },
              properties: { segId: "seg1", timestamp: 1546300800000 }
            },
            {
              type: "Feature",
              geometry: { type: "Point", coordinates: [100, 61] },
              properties: { segId: "seg1", timestamp: 1546304400000 }
            },
            {
              type: "Feature",
              geometry: { type: "Point", coordinates: [101, 60] },
              properties: { segId: "seg2", timestamp: 1546300800000 }
            }
          ]
        });
      });

      it("returns valid geojson when additional features are set", () => {
        const records = [
          {
            seg_id: "seg1",
            lon: 100,
            lat: 60,
            timestamp: "2019-01-01T00:00:00.000Z",
            score: 1,
            course: 10,
            speed: 100
          },
          {
            seg_id: "seg1",
            lon: 100,
            lat: 61,
            timestamp: "2019-01-01T01:00:00.000Z",
            score: 0,
            course: 20,
            speed: 200
          },
          {
            seg_id: "seg2",
            lon: 101,
            lat: 60,
            timestamp: "2019-01-01T00:00:00.000Z",
            score: 1,
            course: 30,
            speed: 300
          }
        ];

        const result = tracks({
          additionalFeatures: ["fishing", "speed", "course"]
        }).formatters.points(records);

        expect(result).to.deep.equal({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: { type: "Point", coordinates: [100, 60] },
              properties: {
                segId: "seg1",
                timestamp: 1546300800000,
                fishing: true,
                course: 10,
                speed: 100
              }
            },
            {
              type: "Feature",
              geometry: { type: "Point", coordinates: [100, 61] },
              properties: {
                segId: "seg1",
                timestamp: 1546304400000,
                fishing: false,
                course: 20,
                speed: 200
              }
            },
            {
              type: "Feature",
              geometry: { type: "Point", coordinates: [101, 60] },
              properties: {
                segId: "seg2",
                timestamp: 1546300800000,
                fishing: true,
                course: 30,
                speed: 300
              }
            }
          ]
        });
      });
    });
  });
});
