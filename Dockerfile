FROM node:14-alpine3.11 As builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build --prod

FROM caddy:2.2.0-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /usr/src/app/dist/documentd-frontend /usr/share/caddy