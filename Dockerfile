FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
ENV NEXT_PUBLIC_WS_BASE_URL=ws://localhost:5000/ws

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
