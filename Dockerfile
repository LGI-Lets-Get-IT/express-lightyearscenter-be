FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app
# COPY package*.json ./
# RUN npm install --production

COPY . .
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]