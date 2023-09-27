FROM oven/bun AS builder
WORKDIR /src
COPY . .
RUN bun i
RUN bun build --compile --outfile kbbi ./src/main.ts

FROM debian:unstable-slim
WORKDIR /app
COPY --from=builder /src/kbbi /app/kbbi
ENTRYPOINT [ "/app/kbbi" ]
