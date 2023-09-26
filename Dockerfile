FROM node:lts-alpine3.18

WORKDIR /app

COPY . .

RUN npx pnpm i
RUN npm run generate

ENTRYPOINT [ "npm", "start" ]
