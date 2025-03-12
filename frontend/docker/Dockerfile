FROM node:20 as dev
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile --silent && yarn cache clean --all

COPY . .

EXPOSE 5173

CMD yarn start