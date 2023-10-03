FROM node:lts-alpine3.18 as builder
WORKDIR /app
COPY package.json ./
RUN npm i
COPY . .
RUN npx tsc
RUN npm prune --omit=dev

FROM node:lts-alpine3.18
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
EXPOSE 3000
CMD [ "node", "./dist/main.js" ]
