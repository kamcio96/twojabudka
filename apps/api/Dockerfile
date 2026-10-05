# Budowany z kontekstem w katalogu głównym repo (patrz docker-compose.yml).
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm ci --no-audit --no-fund
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN npm run build --workspace=@twojabudka/api

# Serwer jest zbundlowany do jednego pliku, więc obraz nie potrzebuje node_modules.
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY --from=build /app/apps/api/dist/server.js ./server.js
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "server.js"]
