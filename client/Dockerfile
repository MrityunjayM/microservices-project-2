FROM node:20 AS package-installer

RUN apt update && apt upgrade -y --no-install-recommends

RUN npm install -g typescript

WORKDIR /app

COPY package*.json .
RUN npm install

FROM node:20-slim

ENV TZ=Asia/Kolkata
ENV NODE_ENV=production
ENV NEXT_PUBLIC_HOST='https://ms.mrityunjay.tech'

WORKDIR /app

COPY --from=package-installer /app/node_modules /app/node_modules

COPY . .
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]