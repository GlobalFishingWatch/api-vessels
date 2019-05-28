const { expect } = require("chai");
const tracks = require("../../src/data/tracks");

describe("data/tracks", () => {
  describe("formatters", () => {
    describe("lines", () => {
      it("returns valid geojson when no additional features are set", () => {
        const records = [
          {
            segId: "seg1",
            lon: 100,
            lat: 60,
            timestamp: "2019-01-01T00:00:00.000Z"
          },
          {
            segId: "seg1",
            lon: 100,
            lat: 61,
            timestamp: "2019-01-01T01:00:00.000Z"
          },
          {
            segId: "seg2",
            lon: 101,
            lat: 60,
            timestamp: "2019-01-01T00:00:00.000Z"
          }
        ];

        const result = tracks({ additionalFeatures: [] }).formatters.lines(
          records
        );

        expect(result).to.deep.equal({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [[100, 60], [100, 61], [101, 60]]
          },
          coordinateProperties: {
            times: [1546300800000, 1546304400000, 1546300800000]
          }
        });
      });

      it("returns valid geojson when additional features are set", () => {
        const records = [
          {
            segId: "seg1",
            lon: 100,
            lat: 60,
            timestamp: "2019-01-01T00:00:00.000Z",
            score: 1,
            course: 10,
            speed: 100
          },
          {
            segId: "seg1",
            lon: 100,
            lat: 61,
            timestamp: "2019-01-01T01:00:00.000Z",
            score: 2,
            course: 20,
            speed: 200
          },
          {
            segId: "seg2",
            lon: 101,
            lat: 60,
            timestamp: "2019-01-01T00:00:00.000Z",
            score: 3,
            course: 30,
            speed: 300
          }
        ];

        const result = tracks({
          additionalFeatures: ["fishing", "speed", "course"]
        }).formatters.lines(records);

        expect(result).to.deep.equal({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [[100, 60], [100, 61], [101, 60]]
          },
          coordinateProperties: {
            times: [1546300800000, 1546304400000, 1546300800000],
            scores: [1, 2, 3],
            courses: [10, 20, 30],
            speeds: [100, 200, 300]
          }
        });
      });
    });

    describe("points", () => {
      it("returns valid geojson when no additional features are set", () => {
        const records = [
          {
            segId: "seg1",
            lon: 100,
            lat: 60,
            timestamp: "2019-01-01T00:00:00.000Z"
          },
          {
            segId: "seg1",
            lon: 100,
            lat: 61,
            timestamp: "2019-01-01T01:00:00.000Z"
          },
          {
            segId: "seg2",
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
              properties: { timestamp: 1546300800000 }
            },
            {
              type: "Feature",
              geometry: { type: "Point", coordinates: [100, 61] },
              properties: { timestamp: 1546304400000 }
            },
            {
              type: "Feature",
              geometry: { type: "Point", coordinates: [101, 60] },
              properties: { timestamp: 1546300800000 }
            }
          ]
        });
      });

      it("returns valid geojson when additional features are set", () => {
        const records = [
          {
            segId: "seg1",
            lon: 100,
            lat: 60,
            timestamp: "2019-01-01T00:00:00.000Z",
            score: 1,
            course: 10,
            speed: 100
          },
          {
            segId: "seg1",
            lon: 100,
            lat: 61,
            timestamp: "2019-01-01T01:00:00.000Z",
            score: 2,
            course: 20,
            speed: 200
          },
          {
            segId: "seg2",
            lon: 101,
            lat: 60,
            timestamp: "2019-01-01T00:00:00.000Z",
            score: 3,
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
                timestamp: 1546300800000,
                score: 1,
                course: 10,
                speed: 100
              }
            },
            {
              type: "Feature",
              geometry: { type: "Point", coordinates: [100, 61] },
              properties: {
                timestamp: 1546304400000,
                score: 2,
                course: 20,
                speed: 200
              }
            },
            {
              type: "Feature",
              geometry: { type: "Point", coordinates: [101, 60] },
              properties: {
                timestamp: 1546300800000,
                score: 3,
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
