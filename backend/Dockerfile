FROM node:23.11-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["dist/index.js"]
