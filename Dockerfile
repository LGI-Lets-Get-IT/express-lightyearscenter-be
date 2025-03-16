FROM node:20 as build

WORKDIR /app
COPY . .
RUN npm install

EXPOSE 3344
CMD ["npm", "start"]