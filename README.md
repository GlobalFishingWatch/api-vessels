# GFW API: Vessels

REST API microservice to search and obtain aggregated vessel information.

## Tech stack

This is a [nodejs](https://nodejs.org/en/) express application built using
[swagger-node](https://github.com/swagger-api/swagger-node).

## Development

### Prerequisites

We use a dockerized development environment, so you will need
[docker](https://www.docker.com/) on your machine and also
[docker-compose](https://docs.docker.com/compose/install/). No other
dependencies are required in your machine.

### Quick start

* Create a service account to allow your development server access to the
  Google Cloud services, and download the json key file into `dev/key.json`.
* Create an empty environment file at `dev/env`.
* Run `docker-compose up`. The application will fail to start, but will guide
  you to configure any missing settings you need to setup in the `dev/env`
  file.

### Common tasks

This is a standard docker-compose project, so you can start all the necessary
connected containers using `docker-compose up`. This will build images as
needed and start a docker cluster with the webserver running on your local port
8080, and the debugging port open on your local port 5858.

If you need to run any npm-specific commands, run them inside the cluster with
`docker-compose run web [COMMAND]`.

### Configuration

#### Environment

Most of the application settings are configured through environment variables.
In your local development environment, you can setup those environment variales
via the `dev/env` file, which is a standard [docker env
file](https://docs.docker.com/compose/env-file/). The actual settings are
defined in [config.js](../src/config.js). We don't provide an env template
since they usually fall out of sync of what's really needed to setup. Instead,
read through the [config.js](../src/config.js)file, as all the environment
settings are described in detail there. In addition to this, if you attempt to
start the application while missing some setting, the application *won't
start*, and a helpful error will be printed to guide you to fix the issue.

### Datasets

The API supports loading data from different datasets. Each dataset is
identified by an id, which has a name (such as `indonesia`) and an optional
version (which defaults to `latest` if not present). Examples of dataset ids
are `indonesia:v20181029`, `indonesia:latest` and `indonesia`.

Each dataset contains a set of properties which describe how to access the data
for that dataset. The following is an example of a dataset object:

```json
{
  "eventsTable": "indonesia_v20181029",
  "pipeline": "pipe_indonesia_production_v20181029",
  "tracksTable": "indonesia_v20181029_tracks",
  "vesselIndex": "andres"-test-indonesia,
  "vesselsTable": "indonesia_v20181029_vessels"
}
```

The datasets objects are loaded from google cloud datastore. To control how to
connect to the datastore, check the configuration section named `datastore`
inside [config.js](../src/config.js).

To manage the datasets, you can use the built-in UI at the [google cloud web
console](https://console.cloud.google.com/datastore/entities;kind=Dataset). You
need to select the proper namespace.


## License

Copyright 2017 Global Fishing Watch

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
applicable law or agreed to in writing, software distributed under the License
is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.

