FROM node:20-alpine3.17 as build
WORKDIR /opt/app

COPY package*.json ./

RUN npm install
RUN npm ci --only=production && npm cache clean --force

COPY . .
RUN npm run build api


FROM node:20-alpine3.17
# CMD ["npx", "nx", "serve", "acc   ount"]
COPY --from=build /opt/app/dist/apps/api ./dist
COPY --from=build /opt/app/node_modules ./node_modules
RUN ls

RUN [ "node", "./dist/main.js" ]