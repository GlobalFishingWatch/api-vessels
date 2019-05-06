const swagger = require("swagger-tools");
const api = require("../api");

module.exports = new Promise(resolve => {
  swagger.initializeMiddleware(api, middleware => {
    resolve(middleware);
  });
});
