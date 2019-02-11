const sql = require('../services/google/sql');

module.exports = dataset => ({
  forVessel(vesselId) {
    const query = sql
      .select(
        "times",
        sql.raw('ST_AsGeoJSON("seg_geography") as "geojson"')
      )
      .from({tracks: dataset.tracksTable})
      .innerJoin({vessels: dataset.vesselsTable}, "tracks.seg_id", "vessels.seg_id")
      .where("vessels.vessel_id", vesselId);

    return query.then((records) => {
      const features = records.map((segment) => {
        const geometry = JSON.parse(segment.geojson);
        geometry.type = 'LineString';

        return {
          type: "Feature",
          properties: {
            coordinateProperties: {
              times: segment.times,
            },
          },
          geometry,
        };
      });

      return {
        type: "FeatureCollection",
        features,
      }
    });
  },
});
