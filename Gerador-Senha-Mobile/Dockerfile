FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ wget

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8081

CMD ["npx", "expo", "start", "--web", "--port", "8081"]