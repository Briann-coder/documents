FROM node:20-alpine AS builder
WORKDIR /app

# Install deps and build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

# Only install production deps
COPY package*.json ./
RUN npm ci --production

# Copy built assets and public folder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./ || true
COPY --from=builder /app/app ./app
COPY --from=builder /app/pages ./pages

ENV NODE_ENV=production
ENV PORT=3000
ENV UPLOAD_BASE_DIR=/data/upload-storage

EXPOSE 3000

# Ensure upload dir exists and set ownership
RUN mkdir -p /data/upload-storage && chown -R node:node /data

USER node

CMD ["node", "./node_modules/next/dist/bin/next", "start", "-p", "3000"]
# Multi-stage Dockerfile for Next.js (documents)
FROM node:18 AS builder
WORKDIR /app

# Install dependencies for build
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source and build
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Install only production deps
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

# Copy build output and public assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/app ./app
COPY --from=builder /app/pages ./pages
COPY --from=builder /app/node_modules ./node_modules

EXPOSE ${PORT}

# Run Next.js production server on provided PORT
CMD ["sh","-c","npx next start -p ${PORT}"]
