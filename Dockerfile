FROM node:lts-alpine3.18
WORKDIR /app
COPY . .
RUN npm i
RUN npm run generate
RUN npx tsx ./src/db/postgres/migrate.ts
RUN rm -rf node_modules
RUN npm ci --omit=dev

ENTRYPOINT [ "npx", "tsx", "./src/main.ts" ]
