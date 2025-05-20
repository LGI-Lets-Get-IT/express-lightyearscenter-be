# FROM node:20 as build

# WORKDIR /app
# # COPY package*.json ./
# # RUN npm install --production

# COPY . .

# EXPOSE 3000
# CMD ["node", "server.js"]

FROM node:20-slim

# Install dependencies required by Chromium
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libgbm1 \
    libpango-1.0-0 \
    libxshmfence1 \
    --no-install-recommends \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Add a non-root user
USER root
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser && \
    mkdir -p /home/pptruser/Downloads && \
    mkdir -p /app && chown -R pptruser:pptruser /app /home/pptruser

WORKDIR /app
COPY . .

USER root
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]
