# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
* [#887](https://github.com/GlobalFishingWatch/GFW-Tasks/issues/887): Adds vessel search and vessel information endpoints, which gets that information from an elastic search cluster. You can configure the elastic search connection through the `elasticsearch` settings in the [config.js](src/config.js) file.
* [#965](https://github.com/GlobalFishingWatch/GFW-Tasks/issues/965): Adds extra features and properties to the GeoJSON object returned in the tracks endpoints. This allows the client to require fishing geometries and per-coordinate data such as speed and course by sending a `features` parameter to the API.
