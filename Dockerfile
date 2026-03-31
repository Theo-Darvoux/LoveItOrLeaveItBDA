FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:20-slim
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./
COPY --from=build /app/package*.json ./

RUN npm install --omit=dev && npm install cross-env

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]
