const datasets = require('../data/datasets');
const vessels = require('../data/vessels');
const tracks = require('../data/tracks');

const loadDataset = async (req, res, next) => {
  try {
    const datasetId = req.swagger.params.dataset.value;
    const dataset = await datasets.get(datasetId);
    if (!dataset) {
      return res.sendStatus(404);
    }
    req.dataset = dataset;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = (app) => {
  app.get('/datasets/:dataset/vessels', loadDataset, async (req, res, next) => {
    try {
      const query = {
        query: req.swagger.params.query.value,
        limit: req.swagger.params.limit.value,
        offset: req.swagger.params.offset.value,
      };

      const results = await vessels(req.dataset).search(query);

      return res.json(results);
    } catch(error) {
      return next(error);
    }
  });

  app.get('/datasets/:dataset/vessels/:vesselid', loadDataset, async (req, res, next) => {
    try {
      const vesselId = req.swagger.params.vesselId.value;

      const result = await vessels(req.dataset).get(vesselId);

      return res.json(result);
    } catch(error) {
      return next(error);
    }
  });


  app.get('/datasets/:dataset/vessels/:vesselId/tracks', loadDataset, async (req, res, next) => {
    try {
      const vesselId = req.swagger.params.vesselId.value;

      const result = await tracks(req.dataset).forVessel(vesselId);

      return res.json(result);
    } catch(error) {
      return next(error);
    }
  });
};
