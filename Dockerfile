# syntax=docker/dockerfile:1

# ---- deps: production-only node_modules ----
FROM oven/bun:1.4 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# ---- build: frontend (vite) + server bundle (esbuild) ----
FROM oven/bun:1.4 AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
# VITE_* values are baked into the frontend bundle at build time.
ARG VITE_FIREBASE_API_KEY=""
ARG VITE_FIREBASE_PROJECT_ID=""
ARG VITE_FIREBASE_APP_ID=""
ARG VITE_FIREBASE_AUTH_DOMAIN=""
ARG VITE_FIREBASE_FIRESTORE_DATABASE_ID=""
ARG VITE_FIREBASE_STORAGE_BUCKET=""
ARG VITE_FIREBASE_MESSAGING_SENDER_ID=""
ARG VITE_FIREBASE_MEASUREMENT_ID=""
ARG VITE_FIREBASE_OAUTH_CLIENT_ID=""
ARG VITE_FIREBASE_RECAPTCHA_SITE_KEY=""
RUN bun run build

# ---- runtime ----
FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./
# server.ts serves PWA assets and reads the datasheet CSV from public/ at runtime
COPY --chown=node:node public ./public
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist/server.cjs"]
