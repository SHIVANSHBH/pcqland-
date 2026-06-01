FROM node:20-alpine AS builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production

FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache tini
COPY --from=builder /app/node_modules ./node_modules
COPY backend/ .
EXPOSE 5000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
