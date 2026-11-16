# syntax=docker/dockerfile:1

# Etapa 1: dependencias y pruebas (la app no tiene dependencias de runtime)
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json ./
COPY src ./src
COPY test ./test
RUN node --test test/app.test.js

# Etapa 2: imagen final mínima, sin shell de root
FROM node:24-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/src ./src
USER node
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
CMD ["node", "src/server.js"]
