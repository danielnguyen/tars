FROM node:8.9-alpine

WORKDIR /usr/app
EXPOSE 3000

ADD . /opt
RUN npm install &&            \
    npm prune --production && \
    npm cache clean

CMD ["npm", "start"]