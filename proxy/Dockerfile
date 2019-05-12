# Setup the environment
FROM node:10-alpine
ARG CONTAINER_PROXY_PARENT_DIR
ENV CONTAINER_PROXY_PARENT_DIR=${CONTAINER_PROXY_PARENT_DIR}
ENV RECORDINGS_DIR=${CONTAINER_PROXY_PARENT_DIR}/recordings
RUN mkdir -p ${CONTAINER_PROXY_PARENT_DIR}/node_modules \
  && chown -R node:node ${CONTAINER_PROXY_PARENT_DIR}/*
WORKDIR ${CONTAINER_PROXY_PARENT_DIR}
# Copy over package related files to install production modules
COPY --chown=node:node ./package*.json ./
# Install production dependencies
RUN npm i --only=prod --quiet
# Expose the default Server's port and Web GUI port
EXPOSE 8001
EXPOSE 8002
# Cleans cache and starts the proxy
CMD ["sh", "-c", "rm -rf /root/.anyproxy/cache && npx anyproxy --intercept --silent --rule $CONTAINER_PROXY_PARENT_DIR/rules"]