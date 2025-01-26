FROM node:20 as build

WORKDIR /usr/app
COPY package.json server.js ./
RUN npm install

FROM node:alpine

WORKDIR /usr/app

COPY --from=build /usr/app /usr/app
EXPOSE 3344
CMD ["node", "server.js"]