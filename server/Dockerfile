FROM node:slim

WORKDIR /server

COPY package.json package.json
RUN npm i -g yarn
RUN yarn

COPY . .

EXPOSE 8080
CMD ["yarn", "start"]
