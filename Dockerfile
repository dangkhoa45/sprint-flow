FROM node:20-alpine AS base

WORKDIR /home/app

RUN corepack enable \
  && corepack prepare pnpm@latest --activate \
  && pnpm config set store-dir .pnpm-store

# Copy package files first
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Clean any existing build artifacts
RUN rm -rf apps/web/.next apps/server/dist

# Build the applications
RUN pnpm run --parallel build

CMD [ "pnpm", "run", "--parallel", "start" ]
