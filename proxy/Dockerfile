FROM node:10-alpine
ARG ANYPROXY_VERSION=4.0.5

EXPOSE 8001
EXPOSE 8002

RUN echo "#!/bin/sh" > /usr/bin/open \
  && echo "exit 0" >> /usr/bin/open \
  && chmod +x /usr/bin/open \
  && npm i -g anyproxy@$ANYPROXY_VERSION

RUN mkdir /anyproxy

CMD ["anyproxy", "--intercept"]