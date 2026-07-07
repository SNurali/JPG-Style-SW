FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/admin/package.json ./apps/admin/
COPY packages/shared/package.json ./packages/shared/
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV CYPRESS_INSTALL_BINARY=0
RUN --mount=type=cache,target=/root/.npm \
    npm install --ignore-scripts

FROM base AS builder
WORKDIR /app
ARG NEXT_PUBLIC_API_URL=
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build --workspace=apps/admin

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN apk add --no-cache dumb-init
COPY --from=builder /app/apps/admin/.next ./apps/admin/.next
COPY --from=builder /app/apps/admin/public ./apps/admin/public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/admin/package.json ./apps/admin/package.json
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/packages/shared ./packages/shared

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3001 || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start", "--workspace=apps/admin"]
