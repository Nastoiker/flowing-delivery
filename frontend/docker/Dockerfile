FROM node:20 as dev
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY . .

EXPOSE 3000

RUN npm run build
RUN npm prune --production
CMD ["npm", "start"]