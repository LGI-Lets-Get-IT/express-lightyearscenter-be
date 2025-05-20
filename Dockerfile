FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app
# COPY package*.json ./
# RUN npm install --production

# Copy files as root
COPY . .

# Fix ownership so the non-root user can work with them
RUN chown -R pptruser:pptruser /app

# Switch to puppeteer's default non-root user
USER pptruser

RUN npm install

EXPOSE 3000
CMD ["npm", "start"]