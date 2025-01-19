FROM node:20 as build

WORKDIR /usr/app
COPY package.json index.js ./
RUN npm install

FROM gcr.io/distroless/nodejs

COPY --from=build /usr/app /
EXPOSE 3344
CMD ["node", "server.js"]