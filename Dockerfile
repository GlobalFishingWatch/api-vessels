################################################################################
# Base dependencies
################################################################################
FROM node:10 AS dependencies

# Setup the project directory
RUN mkdir -p /opt/project
WORKDIR /opt/project

# Setup default command
CMD ["npm", "start"]

# Force environment to production
ENV NODE_ENV=production

# Setup application dependencies
copy package*.json /opt/project/
RUN npm --unsafe-perm install --only production

# Setup the application code
COPY src /opt/project/src

################################################################################
# Development environment
################################################################################
FROM dependencies AS development

# Overwrite environment to development
ENV NODE_ENV=development

# Setup development dependencies
RUN npm --unsafe-perm install --only development

# Setup test code
COPY spec /opt/project/spec

################################################################################
# Productive environment
################################################################################
FROM dependencies AS production
