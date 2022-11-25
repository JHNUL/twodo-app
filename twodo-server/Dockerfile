FROM node:18-alpine3.16

WORKDIR /app

COPY ./dist ./dist
COPY ./html ./html
COPY ./scripts/initDb.mjs ./scripts/
COPY ./package.json yarn.lock ./
RUN yarn install --silent --production --frozen-lockfile\
  && yarn cache clean\
  && node scripts/initDb.mjs

ENV PORT=3001
ENV HOST='0.0.0.0'
ENV SALT_ROUNDS=2
ENV COOKIE_SECRET='something longer than 32 characters'

CMD ["node", "dist/index.js"]
