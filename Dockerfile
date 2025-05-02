FROM node:lts-alpine
EXPOSE 3010
WORKDIR /home/app
COPY . /home/app
RUN [ "npm", "install" ]
CMD [ "npm", "start" ]