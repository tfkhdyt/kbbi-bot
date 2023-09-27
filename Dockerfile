FROM node

WORKDIR /app

COPY . .

RUN npm i && \
  npm run generate && \
  rm -rf node_modules && \
  npm i --production

ENTRYPOINT [ "npx", "tsx", "./src/main.ts" ]
