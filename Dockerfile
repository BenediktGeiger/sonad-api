FROM node:14-alpine
ADD . /
RUN npm ci
RUN npm run build
EXPOSE 8080
ENTRYPOINT npm run start