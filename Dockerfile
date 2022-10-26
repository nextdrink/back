#FROM node:16-alpine AS dev
#
#WORKDIR /app
#COPY package*.json ./
#
#RUN npm install
#
#COPY . .
#
#CMD ["npm", "run", "dev"]
#

FROM node:16-alpine AS prod

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "node", "dist/main.js" ]
