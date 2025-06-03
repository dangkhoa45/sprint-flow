FROM node:20-alpine AS base

WORKDIR /home/app

RUN corepack enable \
  && corepack prepare pnpm@latest --activate \
  && pnpm config set store-dir .pnpm-store

COPY . .

RUN pnpm install

RUN pnpm run --parallel build

CMD [ "pnpm", "run", "--parallel", "start" ]
