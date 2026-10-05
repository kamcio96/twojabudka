# Budowany z kontekstem w katalogu głównym repo (patrz docker-compose.yml).
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm ci --no-audit --no-fund
COPY packages/shared packages/shared
COPY apps/web apps/web
# Umami: wartości wkompilowane w bundle (puste = analityka wyłączona).
ARG VITE_UMAMI_URL=""
ARG VITE_UMAMI_WEBSITE_ID=""
ARG VITE_UMAMI_DOMAINS=""
ENV VITE_UMAMI_URL=$VITE_UMAMI_URL VITE_UMAMI_WEBSITE_ID=$VITE_UMAMI_WEBSITE_ID VITE_UMAMI_DOMAINS=$VITE_UMAMI_DOMAINS
RUN npm run build --workspace=@twojabudka/web

FROM nginx:1.27-alpine
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
