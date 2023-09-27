FROM node

WORKDIR /app

COPY . .

RUN npm i && \
  npm run generate && \
  rm -rf node_modules && \
  npm ci --omit=dev

ENTRYPOINT [ "npx", "tsx", "./src/main.ts" ]
