FROM node:14-alpine

LABEL maintainer="i@i-meto.com"

ENV NODE_ENV=production

EXPOSE 3000

# Run as an unprivileged user.
RUN addgroup -S webapp && adduser -S -G webapp webapp
RUN mkdir /app && chown webapp /app
USER webapp

WORKDIR /app
ENTRYPOINT ["yarn", "start"]

COPY package.json yarn.lock /app/

RUN yarn

COPY . .
