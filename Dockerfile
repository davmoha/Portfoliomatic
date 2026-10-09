# Multi-stage or lightweight Node.js Docker container for Portfoliomatic
FROM node:22-alpine

WORKDIR /app

# Install dependencies first for efficient layer caching
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Build the frontend production bundle (creates dist/)
RUN npm run build

# Expose server port for Traefik / Docker network
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# Run fullstack server
CMD ["npx", "tsx", "server.ts"]
