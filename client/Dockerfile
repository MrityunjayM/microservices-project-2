FROM node:22 AS package-installer

RUN apt update && apt upgrade -y --no-install-recommends

WORKDIR /app

COPY package*.json /app/
RUN npm install

FROM node:22 AS builder

ENV TZ=Asia/Kolkata
ENV NODE_ENV=production
ENV NEXT_PUBLIC_HOST='https://ticketing.mrityunjay.tech'
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY --from=package-installer /app/node_modules /app/node_modules

COPY . .
RUN npm run build

FROM node:22-slim

ENV TZ=Asia/Kolkata
ENV NODE_ENV=production
ENV NEXT_PUBLIC_HOST='https://ticketing.mrityunjay.tech'
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/next.config.js /app/
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/public /app/public
COPY --from=builder /app/.next /app/.next

EXPOSE 3000

CMD [ "npm", "run", "start" ]