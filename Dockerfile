
# Build
FROM node:14-alpine as build-app
ARG NODE_ENV=production
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production=false
COPY . ./
RUN yarn build

# Dev runtime
FROM node:14-alpine as dev
ENV KNEXFILE src/db/config/knexfile.ts
EXPOSE 8080 9229
WORKDIR /usr/src/app
COPY --chown=node:node --from=build-app /usr/src/app ./
RUN yarn install
ENTRYPOINT ["yarn"]
CMD ["start:hot"]