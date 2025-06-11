# Monorepo

## Getting started

```sh
# copy env
cp .env.example .env

# install packages
pnpm install

# start services
docker compose up -d

# install package to server
pnpm i --filter server <package-name>

# install package to web
pnpm i --filter web <package-name>

## Adding new app to workspace

In `apps` directory:

```sh
# Create a new nest app
nest new <app-name> --strict --skip-git --package-manager=pnpm

# Create a new next app
pnpm dlx create-next-app@latest
