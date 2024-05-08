FROM node:20-alpine3.17 as build
WORKDIR /opt/app


COPY ../package*.json ./

RUN npm install


RUN npm ci --only=production && npm cache clean --force

COPY . .

RUN npm run build account

# CMD ["npx", "nx", "serve", "acc   ount"]

FROM node:20-alpine3.17
WORKDIR /opt/app
COPY --from=build /opt/app/dist/apps/account ./dist
COPY --from=build /opt/app/node_modules ./node_modules
RUN ls

RUN [ "node", "./dist/main.js" ]