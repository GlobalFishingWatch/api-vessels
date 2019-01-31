const datasets = require('../data/datasets');
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
  app.get('/datasets/:dataset/vessels', loadDataset, (req, res) => {
    res.sendStatus(200);
  });


  app.get('/datasets/:dataset/vessels/:vesselId/tracks', loadDataset, async (req, res, next) => {
    try {
      const vesselId = req.swagger.params.vesselId.value;

      const result = await tracks(req.dataset).forVessel(vesselId);

      return res.json(result);
    } catch(error) {
      return next(error);
    }
  })
};
