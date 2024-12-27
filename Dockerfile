FROM node:22-alpine

LABEL maintainer="i@i-meto.com"

ENV NODE_ENV=production \
  HTTP_PORT=80 \
  BUCKET_PATH=/tmp/openipdb

EXPOSE 80

RUN mkdir /app \
  && corepack enable

WORKDIR /app
ENTRYPOINT ["pnpm", "start"]

COPY package.json pnpm-lock.yaml /app/

RUN pnpm i \
  && mkdir $BUCKET_PATH \
  && wget https://cdn.jsdelivr.net/npm/openipdb.ipdb@2024.12.27/openipdb.ipdb -O $BUCKET_PATH/openipdb.ipdb

COPY src /app/src
