FROM node:20-alpine

COPY . .

WORKDIR /concert-ticket

RUN npm install && npm cache clean --force

EXPOSE 3000

CMD ["npm", "run", "dev"]
