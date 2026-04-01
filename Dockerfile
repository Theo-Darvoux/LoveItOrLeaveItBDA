FROM node:24-alpine AS build
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

RUN apk add --no-cache curl && \
    curl -sfL https://gobinaries.com/tj/node-prune | sh && \
    node-prune

FROM node:24-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production

USER node

COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/server.js ./
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --from=deps --chown=node:node /app/package.json ./package.json

EXPOSE 3000

CMD ["node", "server.js"]
