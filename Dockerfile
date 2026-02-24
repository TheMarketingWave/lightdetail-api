# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

RUN mkdir -p data && chown -R bun:bun data
VOLUME /app/data

USER bun
ENTRYPOINT [ "bun", "run", "run:container" ]
