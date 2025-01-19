FROM node:20 as build

WORKDIR /usr/app

COPY . .
RUN npm install

FROM node:alpine as main

COPY --from=build /usr/app /
EXPOSE 3344
CMD ["node", "server.js"]