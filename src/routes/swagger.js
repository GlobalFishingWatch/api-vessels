const api = require('../api');

module.exports = (app) => {
  app.get('/api', (req, res) => {
    res.json(api);
  });
};
