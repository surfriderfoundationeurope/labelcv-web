FROM node:alpine

RUN mkdir -p /application
WORKDIR /application

RUN npm install -g http-server
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 80
CMD ["http-server", "dist"]