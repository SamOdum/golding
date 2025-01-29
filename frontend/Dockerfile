# FROM node:20-alpine

# WORKDIR /app

# # Install pnpm
# RUN corepack enable && corepack prepare pnpm@latest --activate

# COPY package*.json ./

# RUN pnpm install

# COPY . .

# EXPOSE 5173

# CMD ["pnpm", "dev", "--host"]

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# Stage 2: Production
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80