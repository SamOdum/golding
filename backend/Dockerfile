# FROM node:20-alpine

# WORKDIR /app

# # Install pnpm
# RUN corepack enable && corepack prepare pnpm@latest --activate

# COPY package*.json ./
# COPY prisma ./prisma/

# RUN pnpm install

# COPY . .

# RUN pnpm prisma:generate

# RUN pnpm build

# EXPOSE 8000

# CMD ["pnpm", "start"]

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/
COPY tsconfig*.json ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma:generate && pnpm build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV production

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/public ./dist/public
COPY --from=builder /app/tsconfig*.json ./

EXPOSE 8000

CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm prisma:seed && pnpm start"]