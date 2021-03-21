# Stage 1 - build
FROM node:12 as build
WORKDIR /usr/src
COPY . .

RUN yarn install
RUN yarn build

# Stage 2 - production
FROM nginx:alpine as prod
WORKDIR /usr/share/nginx/html

COPY --from=build /usr/src/app/dist/bestOfReddit ./
