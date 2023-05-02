FROM node:lts-alpine3.12

RUN apk add curl

WORKDIR /usr/src/app

USER node

CMD ["npm", "run", "start-live-demo-app"]

EXPOSE 3000

EXPOSE 3001