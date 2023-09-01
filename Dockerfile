FROM node:19-alpine

LABEL maintainer="i@i-meto.com"

ENV NODE_ENV=production

EXPOSE 3000

# Run as an unprivileged user.
RUN addgroup -S webapp && adduser -S -G webapp webapp
RUN mkdir /app && chown webapp /app
USER webapp

WORKDIR /app
ENTRYPOINT ["yarn", "start"]

COPY package.json pnpm-lock.yaml /app/

RUN corepack enable && pnpm i

COPY . .
