FROM node:20

WORKDIR /app

ENV NODE_ENV development

ENV PATH /app/node_modules/.bin:$PATH





COPY package.json ./


COPY . .
RUN npx nx run backend:serve:development


CMD ["node", "./dist/apps/backend/main.js"]

