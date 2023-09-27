FROM node:lts-alpine3.18 as builder
RUN wget -qO- https://gobinaries.com/tj/node-prune | sh
WORKDIR /app
COPY package.json ./
RUN npm i --omit=dev
COPY . .
RUN node-prune

FROM node:lts-alpine3.18
WORKDIR /app
COPY --from=builder /app/src ./src
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
EXPOSE 3000
CMD [ "npx", "tsx", "./src/main.ts" ]
