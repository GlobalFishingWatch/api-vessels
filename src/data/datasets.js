const request = require("request-promise");
const { StatusCodeError } = require("request-promise/errors");
const config = require("../config");

module.exports = {
  async get(id) {
    try {
      const response = await request({
        baseUrl: config.platform.settingsServer,
        uri: `/datasets/${id}`,
        json: true
      });

      return response;
    } catch (err) {
      if (err instanceof StatusCodeError && err.statusCode === 404) {
        return undefined;
      }

      throw err;
    }
  },

  async getMultiple(ids) {
    try {
      const response = await request({
        baseUrl: config.platform.settingsServer,
        uri: `/datasets?ids=${ids.join(",")}`,
        json: true
      });

      return response;
    } catch (err) {
      if (err instanceof StatusCodeError && err.statusCode === 404) {
        return undefined;
      }

      throw err;
    }
  }
};
