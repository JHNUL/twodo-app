FROM node:18-alpine3.16

WORKDIR /app

COPY ./dist ./dist
COPY ./html ./html
COPY ./scripts/initDb.mjs ./scripts/
COPY ./package.json yarn.lock ./
RUN yarn install --silent --production --frozen-lockfile\
  && yarn cache clean\
  && node scripts/initDb.mjs

CMD ["node", "dist/index.js"]
