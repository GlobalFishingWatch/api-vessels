# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
* [#1007](https://github.com/GlobalFishingWatch/GFW-Tasks/issues/1007): Changes SQL configuration parameters to be able to connect to Google Cloud SQL. Check the `gcloud.sql` options in [config.js](src/config.js).
* [#887](https://github.com/GlobalFishingWatch/GFW-Tasks/issues/887): Adds vessel search and vessel information endpoints, which gets that information from an elastic search cluster. You can configure the elastic search connection through the `elasticsearch` settings in the [config.js](src/config.js) file.
* [#965](https://github.com/GlobalFishingWatch/GFW-Tasks/issues/965): Adds extra features and properties to the GeoJSON object returned in the tracks endpoints. This allows the client to require fishing geometries and per-coordinate data such as speed and course by sending a `features` parameter to the API.

### Changed
* [#985](https://github.com/GlobalFishingWatch/GFW-Tasks/issues/985): Changes the format in which the tracks are stored in the database. The GeoJSON for the tracks is now generated on the API, since the tables themselves contain raw positional messages.
* [#975](https://github.com/GlobalFishingWatch/GFW-Tasks/issues/975): Changes the way the fishing feature is included in the tracks API. It is now a single feature containing all the fishing points, instead of a feature per tracks. Timestamps for each point are also included.
