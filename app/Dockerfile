# Setup the environment
FROM node:10-alpine
ARG CONTAINER_APP_PARENT_DIR
ARG CONTAINER_APP_DIR
ARG HOST_PROXY_WEB_PORT
ARG NODE_ENV
ARG SERVER_PORT
ENV HOST_PROXY_WEB_PORT=${HOST_PROXY_WEB_PORT}
RUN mkdir -p ${CONTAINER_APP_DIR}/node_modules \
  && chown -R node:node ${CONTAINER_APP_PARENT_DIR}/*
WORKDIR ${CONTAINER_APP_DIR}
# Copy over package related files to install production modules
COPY --chown=node:node ./app/package*.json ./
# Install production dependencies
RUN npm i --only=prod --quiet
# Copy Host code to the Container
COPY --chown=node:node ./app/src ./src
COPY --chown=node:node ./proxy/src/certificates/rootCA.crt /tmp/proxy-cert.crt
# List off contents of final image
RUN ls -la ${CONTAINER_APP_DIR}
# Expose the default port from the server, on the container
EXPOSE ${SERVER_PORT}
# Start the app
CMD ["node", "src/index.js"]