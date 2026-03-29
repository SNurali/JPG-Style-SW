FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
# Next.js monorepo often needs the whole lockfile
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build --workspace=apps/api

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/package.json ./package.json
# Shared files for runtime if needed (types/utils)
COPY --from=builder /app/packages/shared ./packages/shared
# For the schema.sql which is read from __dirname
COPY --from=builder /app/apps/api/src/db/schema.sql ./apps/api/dist/db/schema.sql

EXPOSE 3011
CMD ["node", "apps/api/dist/main.js"]
