const datasets = require("../data/datasets");
const vessels = require("../data/vessels");
const tracks = require("../data/tracks");
const log = require("../data/log");

const loadDataset = async (req, res, next) => {
  try {
    const datasetId = req.swagger.params.dataset.value;

    log.debug(`Loading dataset ${datasetId}`);
    const dataset = await datasets.get(datasetId);
    if (!dataset) {
      log.debug(`Unable to load dataset ${datasetId}`);
      return res.sendStatus(404);
    }
    req.dataset = dataset;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = app => {
  app.get("/tilesets/:tileset/vessels", async (req, res, next) => {
    try {
      const query = {
        query: req.swagger.params.query.value,
        limit: req.swagger.params.limit.value,
        offset: req.swagger.params.offset.value
      };

      log.debug("Querying vessels search index");
      const results = await vessels({
        tileset: req.swagger.params.tileset.value
      }).search(query);

      log.debug(
        `Returning ${results.entries.length} / ${results.total} results`
      );
      return res.json(results);
    } catch (err) {
      return next(err);
    }
  });

  app.get("/tilesets/:tileset/vessels/:vesselid", async (req, res, next) => {
    try {
      const vesselId = req.swagger.params.vesselId.value;

      log.debug(`Looking up vessel information for vessel ${vesselId}`);
      const result = await vessels({
        tileset: req.swagger.params.tileset.value
      }).get(vesselId);

      log.debug("Returning vessel information");
      return res.json(result);
    } catch (error) {
      if (error.statusCode && error.statusCode === 404) {
        return res.sendStatus(404);
      }
      return next(error);
    }
  });

  app.get("/datasets/:dataset/vessels", loadDataset, async (req, res, next) => {
    try {
      const query = {
        query: req.swagger.params.query.value,
        limit: req.swagger.params.limit.value,
        offset: req.swagger.params.offset.value
      };

      log.debug("Querying vessels search index");
      const results = await vessels({ dataset: req.dataset }).search(query);

      log.debug(
        `Returning ${results.entries.length} / ${results.total} results`
      );
      return res.json(results);
    } catch (error) {
      return next(error);
    }
  });

  app.get(
    "/datasets/:dataset/vessels/:vesselid",
    loadDataset,
    async (req, res, next) => {
      try {
        const vesselId = req.swagger.params.vesselId.value;

        log.debug(`Looking up vessel information for vessel ${vesselId}`);
        const result = await vessels({ dataset: req.dataset }).get(vesselId);

        log.debug("Returning vessel information");
        return res.json(result);
      } catch (error) {
        if (error.statusCode && error.statusCode === 404) {
          return res.sendStatus(404);
        }
        return next(error);
      }
    }
  );

  app.get(
    "/datasets/:dataset/vessels/:vesselId/tracks",
    loadDataset,
    async (req, res, next) => {
      try {
        const vesselId = req.swagger.params.vesselId.value;
        const params = {
          startDate: req.swagger.params.startDate.value,
          endDate: req.swagger.params.endDate.value
        };
        const format = req.swagger.params.format.value;
        const features = req.swagger.params.features.value;

        log.debug(
          `Configuring track loader for dataset ${
            req.dataset
          } using additional features ${features}`
        );
        const trackLoader = tracks({
          dataset: req.dataset,
          additionalFeatures: features,
          params
        });

        log.debug(`Looking up track for vessel ${vesselId}`);
        const records = await trackLoader.load(vesselId);

        log.debug(`Converting the records to format ${format}`);
        const result = trackLoader.formatters[format](records);

        log.debug(`Returning track for vessel ${vesselId}`);
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    }
  );
};
