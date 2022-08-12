FROM --platform=linux/amd64 node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD [ "node", "app.js", "--bind 0.0.0.0:$PORT"]