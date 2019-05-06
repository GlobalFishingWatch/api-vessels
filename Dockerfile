################################################################################
# Base dependencies
################################################################################
FROM gcr.io/google_appengine/nodejs AS dependencies

# Setup the project directory
RUN mkdir -p /opt/project
WORKDIR /opt/project

# Setup nodejs
RUN install_node 10.15.3

# Setup application dependencies
copy package*.json /opt/project/
RUN npm --unsafe-perm install --only production

################################################################################
# Development environment
################################################################################
FROM dependencies AS development

# Setup development dependencies
RUN npm --unsafe-perm install --only development

################################################################################
# Productive environment
################################################################################
# Setup the application code
COPY src /opt/project/src
