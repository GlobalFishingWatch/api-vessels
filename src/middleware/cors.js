const cors = require("cors");

module.exports = {
  preflight(method) {
    return cors({
      origin: true,
      methods: `${method},OPTIONS`
    });
  },

  simple() {
    return cors({
      origin: true
    });
  }
};
