# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile

RUN mkdir -p data && chown -R bun:bun data
VOLUME /app/data

USER bun
EXPOSE ${PORT}
ENTRYPOINT [ "bun", "run", "run:container" ]
