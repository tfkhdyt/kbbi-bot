FROM node:lts-alpine3.18

WORKDIR /app

COPY . .

RUN npm i && \
  npm run generate

RUN rm -rf node_modules && \
  npm i --production

ENTRYPOINT [ "npx", "tsx", "./src/main.ts" ]
