# Build stage
FROM oven/bun:1.2-debian AS build

WORKDIR /app

COPY bun.lock package.json ./

RUN bun install --frozen-lockfile --production --verbose

COPY . .

# RUN bun build
RUN bun build --compile --minify --sourcemap ./src --outfile lightdetail-api

# Our application runner
FROM gcr.io/distroless/base-debian12:nonroot AS runner

ENV NODE_ENV=production
WORKDIR /app

ARG BUILD_APP_PORT=3000
ENV APP_PORT=${BUILD_APP_PORT}
EXPOSE ${APP_PORT}

COPY --from=build /app/lightdetail-api .
ENTRYPOINT ["./lightdetail-api"]
