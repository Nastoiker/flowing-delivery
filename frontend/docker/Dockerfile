FROM node:20 as dev
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY . .

EXPOSE 5173

RUN npm run build
RUN npm prune --production
RUN npm ci --only=production && npm cache clean --force

ENTRYPOINT ["/bin/sh", "./entrypoint.sh"]
