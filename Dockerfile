FROM node:14

WORKDIR /home/SyncRest1C
COPY . /home/SyncRest1C

EXPOSE 5000

RUN apt-get update -y
RUN apt-get upgrade -y
RUN npm install
RUN npm run prune

CMD ["npm", "run", "start"]