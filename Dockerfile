FROM oven/bun AS builder

WORKDIR /src

COPY . .

ENV NODE_ENV=production

RUN bun i && \
  bun run generate && \
  bun build --target bun --outfile dist/kbbi.js ./src/main.ts

FROM oven/bun

WORKDIR /app

COPY --from=builder /src/dist/kbbi.js /app/kbbi.js
COPY --from=builder /src/package.json /app/package.json
COPY --from=builder /src/bun.lockb /app/bun.lockb
COPY --from=builder /src/drizzle /app/drizzle

RUN bun i

ENTRYPOINT [ "bun run /app/kbbi.js" ]
