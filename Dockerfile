FROM node:8.11 as build-env
WORKDIR /app
ENV PUBLIC_DIR=/app/public
COPY .npmrc package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build
RUN yarn install --production


# build runtime image
FROM node:8.11-alpine
WORKDIR /app

ARG CIRCLE_SHA1
ENV CIRCLE_SHA1 $CIRCLE_SHA1
ARG CIRCLE_BRANCH
ENV CIRCLE_BRANCH $CIRCLE_BRANCH
ARG CIRCLE_BUILD_NUM
ENV CIRCLE_BUILD_NUM $CIRCLE_BUILD_NUM

EXPOSE 3002
COPY --from=build-env /app/node_modules ./node_modules
COPY --from=build-env /app/build .
ENTRYPOINT ["node", "server.js"]
