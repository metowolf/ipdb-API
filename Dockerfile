FROM node:19-alpine

LABEL maintainer="i@i-meto.com"

ENV NODE_ENV=production

EXPOSE 3000

RUN addgroup -S webapp && adduser -S -G webapp webapp \
  && mkdir /app && chown webapp /app \
  && corepack enable

USER webapp

WORKDIR /app
ENTRYPOINT ["pnpm", "start"]

COPY package.json pnpm-lock.yaml /app/

RUN pnpm i

COPY src /app/src
