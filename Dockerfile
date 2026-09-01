FROM node:18-slim

RUN apt-get update && apt-get install -y \
    libreoffice \
    poppler-utils \
    && apt-get clean

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3001
CMD ["node", "server.js"]