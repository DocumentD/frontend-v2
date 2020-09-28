FROM node:14-alpine3.11 As builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build --prod

FROM nginx:1.19-alpine

COPY --from=builder /usr/src/app/dist/documentd-frontend /usr/share/nginx/html