FROM node:18-slim AS base
RUN apt-get update && \
    apt-get install ca-certificates curl -y --no-install-recommends

# install jemalloc
RUN apt-get update && apt-get install -y libjemalloc-dev && rm -rf /var/lib/apt/lists/*

#set environment variable to preload  jemalloc
ENV LD_PRELOAD="/usr/lib/x86_64-linux-gnu/libjemalloc.so.2"

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store  pnpm i -P --frozen-lockfile --ignore-scripts

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store  pnpm i --frozen-lockfile
RUN pnpm build

FROM base
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
RUN rm .npmrc
EXPOSE 3000
CMD ["npm", "start"]