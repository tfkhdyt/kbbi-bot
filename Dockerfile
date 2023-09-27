FROM oven/bun

WORKDIR /app

COPY . .

RUN bun i && \
  bun run generate

RUN rm -rf node_modules && \
  bun i -p

ENTRYPOINT [ "bun", "start" ]
