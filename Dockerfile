FROM node:20 as build

WORKDIR /usr/app
COPY . .
RUN npm install

EXPOSE 3344
CMD ["node", "server.js"]