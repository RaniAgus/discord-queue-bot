FROM node:16.16.0 as builder

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm ci --ignore-scripts

COPY . .

RUN npm run build


FROM node:16.16.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /app/dist/ dist/
COPY --from=builder /app/assets/ assets/

ENTRYPOINT [ "npm", "run", "prod" ]
