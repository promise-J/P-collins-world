FROM node:22-alpine

ENV NPM_CONFIG_UPDATE_NOTIFIER=false

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

CMD ["npm","run","preview"]