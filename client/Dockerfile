FROM node:23.11-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve

COPY . .

# Use ARG for build-time environment variables
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "dist"]
