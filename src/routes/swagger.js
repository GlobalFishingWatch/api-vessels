const api = require("../api");

module.exports = app => {
  app.get("/openapi.json", (req, res) => {
    res.json(api);
  });
};
