FROM node:16

WORKDIR /app

COPY dist .

COPY package*.json ./
COPY .env ./

RUN npm install
