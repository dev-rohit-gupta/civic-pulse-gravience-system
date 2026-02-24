# Multi-stage Dockerfile for production

# Stage 1: Build dependencies and applications
FROM node:22-alpine AS builder

# Install build dependencies
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY tsconfig.base.json ./

# Copy workspace package files
COPY apps/client/package*.json ./apps/client/
COPY apps/server/package*.json ./apps/server/
COPY packages/*/package*.json ./packages/

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build all packages
RUN npm run build:prod

# Stage 2: Production server
FROM node:22-alpine AS server

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
COPY apps/server/package*.json ./apps/server/
COPY packages/*/package*.json ./packages/

RUN npm ci --only=production --legacy-peer-deps --workspace=@civic-pulse/server

# Copy built server files
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/packages/*/dist ./packages/

# Copy necessary files
COPY apps/server/.env.example ./apps/server/.env.example

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "apps/server/dist/index.js"]

# Stage 3: Production client (Nginx)
FROM nginx:alpine AS client

# Copy built client files
COPY --from=builder /app/apps/client/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
