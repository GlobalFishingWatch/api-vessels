const greenpeace = require("./greenpeace");

const environments = {
  development: {
    inherits: ["all"]
  },

  test: {
    inherits: ["development", "all"]
  },

  production: {
    inherits: ["all"]
  }
};

module.exports = greenpeace.sanitizeEnvironment(environments, {
  log: {
    level: greenpeace.entry({
      key: "LOG_LEVEL",
      doc:
        "Logging level. In increasing amount of logs: error, warn, info, verbose, debug, silly",
      defaults: { all: "debug" },
      required: true
    })
  },

  server: {
    host: greenpeace.entry({
      key: "HOST",
      doc: "Protocol, host and port where the server is exposed to clients.",
      defaults: { development: "http://localhost:8080" },
      required: true
    }),

    port: greenpeace.entry({
      key: "PORT",
      doc: "Port on which the server is exposed to clients.",
      defaults: { development: 8080 },
      required: true
    }),

    protocol: greenpeace.entry({
      key: "PROTOCOL",
      doc: "Protocol by which the server is exposed to clients.",
      defaults: { development: "http", production: "https" },
      required: true
    })
  },

  elasticsearch: {
    server: greenpeace.entry({
      key: "ELASTICSEARCH_SERVER",
      doc:
        "ElasticSearch server URL to connect to. Should be a complete url to the root of the server, such as https://user:password@elasticsearch.skytruth.org",
      defaults: { test: "dummy" },
      required: true
    })
  },

  platform: {
    settingsServer: greenpeace.entry({
      key: "PLATFORM_SETTINGS_SERVER",
      doc: "Protocol, host and port of the settings API",
      defaults: {
        development: "https://settings.api.dev.globalfishingwatch.org"
      },
      required: true
    })
  },

  gcloud: {
    sql: {
      user: greenpeace.entry({
        key: "GCLOUD_SQL_USER",
        doc: "Google Cloud SQL username",
        defaults: { test: "dummy" },
        required: true
      }),
      password: greenpeace.entry({
        key: "GCLOUD_SQL_PASSWORD",
        doc: "Google Cloud SQL password",
        defaults: { test: "dummy" },
        required: true
      }),
      db: greenpeace.entry({
        key: "GCLOUD_SQL_DB",
        doc: "Google Cloud SQL database to connect to",
        defaults: { test: "dummy" },
        required: true
      }),
      instance: greenpeace.entry({
        key: "GCLOUD_SQL_INSTANCE",
        doc: "Google Cloud SQL instance to connect to",
        defaults: { test: "dummy" },
        required: true
      })
    }
  }
});
