FROM node:16-alpine
WORKDIR /app
COPY . /app
RUN npm ci
RUN npm run build
EXPOSE 8083
# make dev and start different based on NODE_ENV
ENTRYPOINT npm run start