# Setup the environment
FROM node:10-alpine AS release
ARG CONTAINER_APP_PARENT_DIR
ARG CONTAINER_APP_DIR
ARG NODE_ENV
ARG SERVER_PORT
RUN mkdir -p ${CONTAINER_APP_DIR}/node_modules \
  && chown -R node:node ${CONTAINER_APP_PARENT_DIR}/*
WORKDIR ${CONTAINER_APP_DIR}
# Copy over package related files to install production modules
COPY --chown=node:node ./package*.json ./
# Install production dependencies
RUN npm i --only=production --quiet
# Copy Host code to the Container
COPY --chown=node:node ./server ./server
COPY --chown=node:node ./.mitmproxy/mitmproxy-ca-cert.pem /tmp/
# List off contents of final image
RUN ls -la ${CONTAINER_APP_DIR}
# Expose the default port from the server, on the container
EXPOSE ${SERVER_PORT}
# Start the app
CMD ["node", "server/index.js"]