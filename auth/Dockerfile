FROM node:lts AS package-installer

RUN apt update && apt upgrade -y --no-install-recommends

RUN npm install -g typescript

WORKDIR /app

COPY package*.json ./

RUN npm ci --include=dev

FROM node:lts-slim

RUN apt update && apt upgrade -y --no-install-recommends

WORKDIR /app

COPY --from=package-installer /app/node_modules /app/node_modules
COPY . .

# USER node

EXPOSE 3000

CMD [ "npm", "start" ]