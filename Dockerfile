FROM node:20-alpine

WORKDIR /concert-ticket

COPY . /concert-ticket

RUN npm install && npm cache clean --force

EXPOSE 3000

CMD ["npm", "run", "dev"]
