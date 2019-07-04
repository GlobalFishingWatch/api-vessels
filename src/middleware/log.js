const url = require("url");
const log = require("../data/log");

module.exports = {
  logger() {
    return (req, res, next) => {
      req.loggingStartTime = new Date();

      const originalEnd = res.end;
      res.end = (chunk, encoding) => {
        res.end = originalEnd;
        res.end(chunk, encoding);

        const latency = (new Date() - req.loggingStartTime) / 1000;

        const httpRequest = {
          requestMethod: req.method,
          requestUrl: url.format({
            protocol: req.protocol,
            host: req.hostname,
            pathname: req.originalUrl
          }),
          requestSize: req.socket.bytesRead,
          status: res.statusCode,
          userAgent: req.get("user-agent"),
          remoteIp: req.ip,
          latency: `${latency}s`
        };

        log.info(`HTTP ${req.method} ${req.originalUrl}`, { httpRequest });
      };

      next();
    };
  },

  errorLogger() {
    return (err, req, res, next) => {
      const message = err.message || "(no error message)";
      const stack = err.stack || "(no stack trace)";
      const logMessage = [`uncaught exception ${message}:`, stack].join("\n");
      log.error(logMessage);
      next(err);
    };
  }
};
